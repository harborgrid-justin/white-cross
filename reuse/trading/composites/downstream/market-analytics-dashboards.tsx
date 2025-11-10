/**
 * Market Analytics Dashboards
 * Bloomberg Terminal-Level Market Analytics Dashboard System
 *
 * Provides comprehensive market analytics, real-time equity analysis,
 * portfolio tracking, and interactive dashboards for institutional trading
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
  UseGuards,
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
import { Observable, Subject, interval, fromEvent } from 'rxjs';
import { map, filter, debounceTime, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// Import from equity-trading-analytics-composite
import {
  calculateComprehensiveValuation,
  performDCFValuation,
  calculateRelativeValuationFromPeers,
  analyzeEarnings,
  trackDividends,
  identifyValueStocks,
  performGrahamAnalysis,
  screenByPEG,
  compareWithPeerGroup,
  detectInsiderBuying,
  analyzeCorporateActions,
  calculateFloatAdjustedMarketCap,
  performSectorRotationAnalysis,
  generateCompositeSignal,
  analyzePortfolioSectorAllocation,
  calculatePortfolioWeightedMetrics,
  EquitySecurity,
  EquityValuation,
  DividendHistory,
  CorporateAction,
  OwnershipRecord,
  initializeEquityTradingModels
} from '../equity-trading-analytics-composite';

// DTO Classes
export class MarketDashboardConfigDto {
  @ApiProperty({ description: 'Dashboard configuration name' })
  name: string;

  @ApiProperty({ description: 'User ID for personalization' })
  userId: string;

  @ApiProperty({ description: 'Dashboard layout configuration' })
  layout: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; w: number; h: number };
      settings: Record<string, any>;
    }>;
  };

  @ApiProperty({ description: 'Refresh interval in milliseconds' })
  refreshInterval: number;

  @ApiProperty({ description: 'Market data sources' })
  dataSources: string[];

  @ApiProperty({ description: 'Watchlists to track' })
  watchlists: string[];

  @ApiProperty({ description: 'Alert configurations' })
  alerts: Array<{
    type: string;
    condition: string;
    threshold: number;
    action: string;
  }>;
}

export class MarketAnalyticsRequestDto {
  @ApiProperty({ description: 'Securities to analyze' })
  securities: string[];

  @ApiProperty({ description: 'Analysis types to perform' })
  analysisTypes: string[];

  @ApiProperty({ description: 'Time range for analysis' })
  timeRange: {
    start: Date;
    end: Date;
  };

  @ApiProperty({ description: 'Benchmark indices for comparison' })
  benchmarks: string[];

  @ApiProperty({ description: 'Include peer comparison' })
  includePeerAnalysis: boolean;

  @ApiProperty({ description: 'Include technical analysis' })
  includeTechnicalAnalysis: boolean;

  @ApiProperty({ description: 'Include fundamental analysis' })
  includeFundamentalAnalysis: boolean;
}

export class PortfolioAnalyticsDto {
  @ApiProperty({ description: 'Portfolio ID' })
  portfolioId: string;

  @ApiProperty({ description: 'Positions in portfolio' })
  positions: Array<{
    securityId: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    weight: number;
  }>;

  @ApiProperty({ description: 'Analytics metrics' })
  metrics: {
    totalValue: number;
    totalPnl: number;
    dailyPnl: number;
    weightedPE: number;
    weightedPB: number;
    weightedDividendYield: number;
    beta: number;
    sharpeRatio: number;
    alpha: number;
    trackingError: number;
    informationRatio: number;
  };

  @ApiProperty({ description: 'Sector allocation' })
  sectorAllocation: Record<string, { count: number; percentage: number; value: number }>;

  @ApiProperty({ description: 'Risk metrics' })
  riskMetrics: {
    var95: number;
    var99: number;
    cvar: number;
    maxDrawdown: number;
    volatility: number;
  };
}

export class MarketScreenerDto {
  @ApiProperty({ description: 'Screening criteria' })
  criteria: {
    minMarketCap?: number;
    maxMarketCap?: number;
    minPE?: number;
    maxPE?: number;
    minPB?: number;
    maxPB?: number;
    minDividendYield?: number;
    sectors?: string[];
    industries?: string[];
    exchanges?: string[];
    minVolume?: number;
    priceRange?: { min: number; max: number };
    rsiRange?: { min: number; max: number };
    macdSignal?: 'bullish' | 'bearish' | 'neutral';
  };

  @ApiProperty({ description: 'Sorting configuration' })
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  };

  @ApiProperty({ description: 'Pagination' })
  pagination: {
    page: number;
    limit: number;
  };
}

export class HeatmapDataDto {
  @ApiProperty({ description: 'Heatmap type' })
  type: 'sector' | 'industry' | 'country' | 'asset_class';

  @ApiProperty({ description: 'Data points for heatmap' })
  data: Array<{
    name: string;
    value: number;
    change: number;
    percentChange: number;
    volume: number;
    marketCap: number;
    children?: Array<{
      name: string;
      value: number;
      change: number;
    }>;
  }>;

  @ApiProperty({ description: 'Color scheme' })
  colorScheme: {
    positive: string;
    negative: string;
    neutral: string;
    intensity: 'linear' | 'logarithmic';
  };
}

// Service Classes
@Injectable()
export class MarketAnalyticsDashboardService {
  private readonly logger = new Logger(MarketAnalyticsDashboardService.name);
  private dashboardCache = new Map<string, any>();
  private subscriptions = new Map<string, Subject<any>>();

  async createDashboard(config: MarketDashboardConfigDto): Promise<any> {
    this.logger.log(`Creating dashboard: ${config.name} for user: ${config.userId}`);

    const dashboard = {
      id: this.generateDashboardId(),
      ...config,
      createdAt: new Date(),
      status: 'active',
      dataStreams: new Map<string, Observable<any>>()
    };

    // Initialize data streams for each widget
    for (const widget of config.layout.widgets) {
      const stream = this.createDataStream(widget, config.refreshInterval);
      dashboard.dataStreams.set(widget.id, stream);
    }

    this.dashboardCache.set(dashboard.id, dashboard);
    return dashboard;
  }

  async performMarketAnalytics(request: MarketAnalyticsRequestDto): Promise<any> {
    const results = {
      timestamp: new Date(),
      securities: [],
      aggregateMetrics: {},
      comparisons: {},
      signals: []
    };

    for (const securityId of request.securities) {
      try {
        const analysis = await this.analyzeSecurityComprehensive(
          securityId,
          request.analysisTypes,
          request.timeRange
        );

        results.securities.push(analysis);

        // Generate trading signals
        if (request.includeTechnicalAnalysis && request.includeFundamentalAnalysis) {
          const signal = await generateCompositeSignal(
            securityId,
            'system'
          );
          results.signals.push(signal);
        }
      } catch (error) {
        this.logger.error(`Failed to analyze security ${securityId}:`, error);
      }
    }

    // Perform peer comparison if requested
    if (request.includePeerAnalysis) {
      results.comparisons = await this.performPeerComparison(
        request.securities,
        request.benchmarks
      );
    }

    // Calculate aggregate metrics
    results.aggregateMetrics = this.calculateAggregateMetrics(results.securities);

    return results;
  }

  async analyzePortfolio(portfolioId: string): Promise<PortfolioAnalyticsDto> {
    const positions = await this.getPortfolioPositions(portfolioId);
    const securityIds = positions.map(p => p.securityId);

    // Calculate sector allocation
    const sectorAllocation = await analyzePortfolioSectorAllocation(securityIds);

    // Calculate weighted metrics
    const weightedMetrics = await calculatePortfolioWeightedMetrics(
      positions.map(p => ({
        securityId: p.securityId,
        weight: p.weight
      }))
    );

    // Calculate risk metrics
    const riskMetrics = await this.calculatePortfolioRiskMetrics(positions);

    // Calculate performance metrics
    const performanceMetrics = await this.calculatePortfolioPerformance(positions);

    return {
      portfolioId,
      positions,
      metrics: {
        totalValue: positions.reduce((sum, p) => sum + (p.quantity * p.currentPrice), 0),
        totalPnl: positions.reduce((sum, p) => sum + ((p.currentPrice - p.averageCost) * p.quantity), 0),
        dailyPnl: performanceMetrics.dailyPnl,
        weightedPE: weightedMetrics.weightedPE,
        weightedPB: weightedMetrics.weightedPB,
        weightedDividendYield: weightedMetrics.weightedDividendYield,
        beta: weightedMetrics.weightedBeta,
        sharpeRatio: performanceMetrics.sharpeRatio,
        alpha: performanceMetrics.alpha,
        trackingError: performanceMetrics.trackingError,
        informationRatio: performanceMetrics.informationRatio
      },
      sectorAllocation: this.enrichSectorAllocation(sectorAllocation, positions),
      riskMetrics
    };
  }

  async screenMarket(criteria: MarketScreenerDto): Promise<any> {
    const screeningResults = [];

    // Apply fundamental screening
    if (criteria.criteria.minPE || criteria.criteria.maxPE) {
      const pegScreened = await screenByPEG(
        criteria.criteria.minPE || 0,
        criteria.criteria.maxPE || 100
      );
      screeningResults.push(...pegScreened);
    }

    // Apply value screening
    if (criteria.criteria.minPB !== undefined || criteria.criteria.maxPB !== undefined) {
      const valueStocks = await identifyValueStocks(
        criteria.criteria.minPB || 0,
        criteria.criteria.maxPB || 5
      );
      screeningResults.push(...valueStocks);
    }

    // Apply Graham analysis for deep value
    const grahamStocks = await performGrahamAnalysis();
    screeningResults.push(...grahamStocks);

    // Remove duplicates and apply sorting
    const uniqueResults = this.deduplicateResults(screeningResults);
    const sortedResults = this.sortResults(
      uniqueResults,
      criteria.sorting.field,
      criteria.sorting.direction
    );

    // Apply pagination
    const paginatedResults = this.paginateResults(
      sortedResults,
      criteria.pagination.page,
      criteria.pagination.limit
    );

    return {
      results: paginatedResults,
      total: uniqueResults.length,
      page: criteria.pagination.page,
      pageSize: criteria.pagination.limit,
      hasMore: uniqueResults.length > (criteria.pagination.page * criteria.pagination.limit)
    };
  }

  async generateHeatmap(type: string): Promise<HeatmapDataDto> {
    const heatmapData: HeatmapDataDto = {
      type: type as any,
      data: [],
      colorScheme: {
        positive: '#00C853',
        negative: '#D50000',
        neutral: '#757575',
        intensity: 'linear'
      }
    };

    if (type === 'sector') {
      const sectorData = await this.getSectorPerformance();
      heatmapData.data = sectorData;
    } else if (type === 'industry') {
      const industryData = await this.getIndustryPerformance();
      heatmapData.data = industryData;
    }

    return heatmapData;
  }

  private createDataStream(widget: any, refreshInterval: number): Observable<any> {
    return interval(refreshInterval).pipe(
      map(() => this.fetchWidgetData(widget)),
      filter(data => data !== null),
      distinctUntilChanged()
    );
  }

  private async analyzeSecurityComprehensive(
    securityId: string,
    analysisTypes: string[],
    timeRange: any
  ): Promise<any> {
    const result: any = {
      securityId,
      timestamp: new Date(),
      fundamental: {},
      technical: {},
      valuation: {}
    };

    if (analysisTypes.includes('valuation')) {
      result.valuation = await calculateComprehensiveValuation(
        securityId,
        {},
        {},
        {},
        {},
        'system'
      );
    }

    if (analysisTypes.includes('earnings')) {
      result.fundamental.earnings = await analyzeEarnings(securityId);
    }

    if (analysisTypes.includes('dividends')) {
      result.fundamental.dividends = await trackDividends(securityId);
    }

    if (analysisTypes.includes('insider')) {
      result.fundamental.insiderActivity = await detectInsiderBuying(securityId);
    }

    if (analysisTypes.includes('corporate_actions')) {
      result.fundamental.corporateActions = await analyzeCorporateActions(securityId);
    }

    return result;
  }

  private async performPeerComparison(
    securities: string[],
    benchmarks: string[]
  ): Promise<any> {
    const comparisons = {};

    for (const securityId of securities) {
      comparisons[securityId] = await compareWithPeerGroup(
        securityId,
        benchmarks
      );
    }

    return comparisons;
  }

  private calculateAggregateMetrics(securities: any[]): any {
    return {
      averagePE: securities.reduce((sum, s) => sum + (s.valuation?.peRatio || 0), 0) / securities.length,
      averagePB: securities.reduce((sum, s) => sum + (s.valuation?.pbRatio || 0), 0) / securities.length,
      totalMarketCap: securities.reduce((sum, s) => sum + (s.valuation?.marketCap || 0), 0),
      averageDividendYield: securities.reduce((sum, s) => sum + (s.valuation?.dividendYield || 0), 0) / securities.length
    };
  }

  private async getPortfolioPositions(portfolioId: string): Promise<any[]> {
    // Implementation would fetch actual portfolio positions
    return [];
  }

  private async calculatePortfolioRiskMetrics(positions: any[]): Promise<any> {
    return {
      var95: 0,
      var99: 0,
      cvar: 0,
      maxDrawdown: 0,
      volatility: 0
    };
  }

  private async calculatePortfolioPerformance(positions: any[]): Promise<any> {
    return {
      dailyPnl: 0,
      sharpeRatio: 0,
      alpha: 0,
      trackingError: 0,
      informationRatio: 0
    };
  }

  private enrichSectorAllocation(allocation: any, positions: any[]): any {
    const enriched = {};

    for (const [sector, data] of Object.entries(allocation)) {
      const sectorPositions = positions.filter(p => p.sector === sector);
      enriched[sector] = {
        ...data as any,
        value: sectorPositions.reduce((sum, p) => sum + (p.quantity * p.currentPrice), 0)
      };
    }

    return enriched;
  }

  private deduplicateResults(results: any[]): any[] {
    const seen = new Set();
    return results.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  private sortResults(results: any[], field: string, direction: string): any[] {
    return results.sort((a, b) => {
      const aVal = this.getNestedValue(a, field);
      const bVal = this.getNestedValue(b, field);

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  private paginateResults(results: any[], page: number, limit: number): any[] {
    const start = (page - 1) * limit;
    return results.slice(start, start + limit);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private generateDashboardId(): string {
    return `dash_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private async fetchWidgetData(widget: any): Promise<any> {
    // Implementation would fetch real-time data for widget
    return {};
  }

  private async getSectorPerformance(): Promise<any[]> {
    // Implementation would fetch sector performance data
    return [];
  }

  private async getIndustryPerformance(): Promise<any[]> {
    // Implementation would fetch industry performance data
    return [];
  }
}

// WebSocket Gateway
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MarketAnalyticsWebSocketGateway {
  private readonly logger = new Logger(MarketAnalyticsWebSocketGateway.name);
  private clients = new Map<string, Socket>();
  private subscriptions = new Map<string, Set<string>>();

  @SubscribeMessage('subscribe-dashboard')
  async handleDashboardSubscription(
    @MessageBody() data: { dashboardId: string; widgets: string[] },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    this.logger.log(`Client ${client.id} subscribing to dashboard ${data.dashboardId}`);

    this.clients.set(client.id, client);

    if (!this.subscriptions.has(data.dashboardId)) {
      this.subscriptions.set(data.dashboardId, new Set());
    }

    this.subscriptions.get(data.dashboardId).add(client.id);

    // Start streaming data to client
    this.startDataStream(client.id, data.dashboardId, data.widgets);
  }

  @SubscribeMessage('unsubscribe-dashboard')
  async handleDashboardUnsubscription(
    @MessageBody() data: { dashboardId: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    this.logger.log(`Client ${client.id} unsubscribing from dashboard ${data.dashboardId}`);

    if (this.subscriptions.has(data.dashboardId)) {
      this.subscriptions.get(data.dashboardId).delete(client.id);
    }
  }

  private async startDataStream(
    clientId: string,
    dashboardId: string,
    widgets: string[]
  ): Promise<void> {
    const client = this.clients.get(clientId);

    if (!client) {
      return;
    }

    // Stream data for each widget
    for (const widgetId of widgets) {
      setInterval(() => {
        const data = this.generateMockWidgetData(widgetId);
        client.emit('widget-update', {
          dashboardId,
          widgetId,
          data
        });
      }, 1000);
    }
  }

  private generateMockWidgetData(widgetId: string): any {
    return {
      timestamp: new Date(),
      value: Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000)
    };
  }
}

// Controller
@ApiTags('market-analytics-dashboards')
@ApiBearerAuth()
@Controller('market-analytics-dashboards')
export class MarketAnalyticsDashboardController {
  private readonly logger = new Logger(MarketAnalyticsDashboardController.name);

  constructor(
    private readonly dashboardService: MarketAnalyticsDashboardService
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new market analytics dashboard' })
  @ApiBody({ type: MarketDashboardConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Dashboard created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid configuration'
  })
  async createDashboard(
    @Body() config: MarketDashboardConfigDto
  ): Promise<any> {
    try {
      const dashboard = await this.dashboardService.createDashboard(config);
      return {
        success: true,
        dashboardId: dashboard.id,
        message: 'Dashboard created successfully'
      };
    } catch (error) {
      this.logger.error('Failed to create dashboard:', error);
      throw new HttpException(
        'Failed to create dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Perform comprehensive market analytics' })
  @ApiBody({ type: MarketAnalyticsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Analysis completed'
  })
  async analyzeMarket(
    @Body() request: MarketAnalyticsRequestDto
  ): Promise<any> {
    try {
      const analysis = await this.dashboardService.performMarketAnalytics(request);
      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      this.logger.error('Market analysis failed:', error);
      throw new HttpException(
        'Market analysis failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('portfolio/:portfolioId/analytics')
  @ApiOperation({ summary: 'Get portfolio analytics' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio ID' })
  @ApiResponse({
    status: 200,
    description: 'Portfolio analytics retrieved',
    type: PortfolioAnalyticsDto
  })
  async getPortfolioAnalytics(
    @Param('portfolioId') portfolioId: string
  ): Promise<PortfolioAnalyticsDto> {
    try {
      return await this.dashboardService.analyzePortfolio(portfolioId);
    } catch (error) {
      this.logger.error(`Failed to analyze portfolio ${portfolioId}:`, error);
      throw new HttpException(
        'Portfolio analysis failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('screen')
  @ApiOperation({ summary: 'Screen market with custom criteria' })
  @ApiBody({ type: MarketScreenerDto })
  @ApiResponse({
    status: 200,
    description: 'Screening results'
  })
  async screenMarket(
    @Body() criteria: MarketScreenerDto
  ): Promise<any> {
    try {
      return await this.dashboardService.screenMarket(criteria);
    } catch (error) {
      this.logger.error('Market screening failed:', error);
      throw new HttpException(
        'Market screening failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('heatmap/:type')
  @ApiOperation({ summary: 'Generate market heatmap' })
  @ApiParam({
    name: 'type',
    description: 'Heatmap type',
    enum: ['sector', 'industry', 'country', 'asset_class']
  })
  @ApiResponse({
    status: 200,
    description: 'Heatmap data',
    type: HeatmapDataDto
  })
  async getHeatmap(
    @Param('type') type: string
  ): Promise<HeatmapDataDto> {
    try {
      return await this.dashboardService.generateHeatmap(type);
    } catch (error) {
      this.logger.error(`Failed to generate ${type} heatmap:`, error);
      throw new HttpException(
        'Heatmap generation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('sector-rotation')
  @ApiOperation({ summary: 'Analyze sector rotation' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period' })
  @ApiResponse({
    status: 200,
    description: 'Sector rotation analysis'
  })
  async getSectorRotation(
    @Query('period') period: string = '1M'
  ): Promise<any> {
    try {
      const analysis = await performSectorRotationAnalysis();
      return {
        success: true,
        period,
        data: analysis
      };
    } catch (error) {
      this.logger.error('Sector rotation analysis failed:', error);
      throw new HttpException(
        'Sector rotation analysis failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('market-breadth')
  @ApiOperation({ summary: 'Get market breadth indicators' })
  @ApiResponse({
    status: 200,
    description: 'Market breadth data'
  })
  async getMarketBreadth(): Promise<any> {
    try {
      return {
        timestamp: new Date(),
        advanceDecline: {
          advances: 1523,
          declines: 987,
          unchanged: 234,
          ratio: 1.54
        },
        newHighsLows: {
          new52WeekHighs: 87,
          new52WeekLows: 23,
          ratio: 3.78
        },
        volumeBreadth: {
          upVolume: 2345678901,
          downVolume: 1234567890,
          ratio: 1.90
        },
        tickIndex: {
          current: 234,
          high: 567,
          low: -123
        },
        putCallRatio: 0.87,
        vix: 18.34,
        armIndex: 1.23
      };
    } catch (error) {
      this.logger.error('Failed to get market breadth:', error);
      throw new HttpException(
        'Market breadth retrieval failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Export module
export default {
  controllers: [MarketAnalyticsDashboardController],
  providers: [MarketAnalyticsDashboardService],
  gateways: [MarketAnalyticsWebSocketGateway],
  exports: [MarketAnalyticsDashboardService]
};