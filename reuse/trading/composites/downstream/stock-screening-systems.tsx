/**
 * LOC: WC-DOWN-TRADING-SCREEN-081
 * File: /reuse/trading/composites/downstream/stock-screening-systems.tsx
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - ../equity-trading-analytics-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Stock screening UI components
 *   - Portfolio construction services
 *   - Investment research platforms
 *
 * Purpose: Bloomberg Terminal-Level Stock Screening Systems
 * Production-ready Next.js/React/TypeScript components with NestJS controllers
 * for comprehensive equity screening, filtering, and analysis capabilities.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';

// Import from equity-trading-analytics-composite
import {
  EquitySecurity,
  EquityValuation,
  MarketCapCategory,
  TradingStatus,
  screenByValuation,
  screenByGrowth,
  screenDividendStocks,
  screenValueStocks,
  getPeerGroup,
  compareToPeers,
  getSecuritiesBySectorIndustry,
  getSecuritiesByMarketCap,
  createEquitySecurity,
  getEquityBySymbol,
  calculateEquityValuation,
  getLatestValuation,
  calculateDividendYield,
  analyzePortfolioSectorAllocation,
  calculatePortfolioWeightedMetrics,
} from '../equity-trading-analytics-composite';

// ============================================================================
// DTOs AND INTERFACES
// ============================================================================

/**
 * Screening criteria DTO
 */
class ScreeningCriteriaDto {
  @ApiProperty({ description: 'Maximum P/E ratio', example: 15, required: false })
  maxPE?: number;

  @ApiProperty({ description: 'Maximum P/B ratio', example: 1.5, required: false })
  maxPB?: number;

  @ApiProperty({ description: 'Minimum dividend yield (%)', example: 3.0, required: false })
  minDividendYield?: number;

  @ApiProperty({ description: 'Maximum debt to equity ratio', example: 0.5, required: false })
  maxDebtToEquity?: number;

  @ApiProperty({ description: 'Minimum market cap', example: 1000000000, required: false })
  minMarketCap?: number;

  @ApiProperty({ description: 'Maximum market cap', example: 50000000000, required: false })
  maxMarketCap?: number;

  @ApiProperty({ description: 'Minimum revenue growth (%)', example: 10, required: false })
  minRevenueGrowth?: number;

  @ApiProperty({ description: 'Minimum EPS growth (%)', example: 15, required: false })
  minEPSGrowth?: number;

  @ApiProperty({ description: 'Sector filter', example: 'Technology', required: false })
  sector?: string;

  @ApiProperty({ description: 'Industry filter', example: 'Software', required: false })
  industry?: string;

  @ApiProperty({ description: 'Market cap category', enum: MarketCapCategory, required: false })
  marketCapCategory?: MarketCapCategory;

  @ApiProperty({ description: 'Minimum consecutive dividend years', example: 5, required: false })
  minConsecutiveDividendYears?: number;
}

/**
 * Screen result DTO
 */
class ScreenResultDto {
  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiProperty({ description: 'Sector' })
  sector: string;

  @ApiProperty({ description: 'Industry' })
  industry: string;

  @ApiProperty({ description: 'Market cap category' })
  marketCapCategory: string;

  @ApiProperty({ description: 'Current price' })
  currentPrice: number;

  @ApiProperty({ description: 'Market capitalization' })
  marketCap: number;

  @ApiProperty({ description: 'P/E ratio' })
  peRatio: number | null;

  @ApiProperty({ description: 'P/B ratio' })
  pbRatio: number | null;

  @ApiProperty({ description: 'Dividend yield (%)' })
  dividendYield: number | null;

  @ApiProperty({ description: 'EPS growth (%)' })
  epsGrowth: number | null;

  @ApiProperty({ description: 'Trading status' })
  tradingStatus: string;
}

/**
 * Peer comparison DTO
 */
class PeerComparisonDto {
  @ApiProperty({ description: 'Security ID' })
  securityId: string;

  @ApiProperty({ description: 'Symbol' })
  symbol: string;

  @ApiProperty({ description: 'Name' })
  name: string;

  @ApiProperty({ description: 'Peer count' })
  peerCount: number;

  @ApiProperty({ description: 'P/E comparison' })
  peComparison: {
    value: number;
    peerAverage: number;
    percentile: number;
  };

  @ApiProperty({ description: 'P/B comparison' })
  pbComparison: {
    value: number;
    peerAverage: number;
    percentile: number;
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class StockScreeningService {
  private readonly logger = new Logger(StockScreeningService.name);

  /**
   * Screen stocks by valuation criteria
   */
  async screenByValuationCriteria(criteria: ScreeningCriteriaDto): Promise<EquitySecurity[]> {
    this.logger.log(`Screening stocks by valuation criteria`);
    try {
      const results = await screenByValuation(criteria);
      this.logger.log(`Found ${results.length} securities matching valuation criteria`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to screen by valuation: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to screen stocks by valuation criteria');
    }
  }

  /**
   * Screen stocks by growth metrics
   */
  async screenByGrowthMetrics(
    minRevenueGrowth: number,
    minEPSGrowth: number
  ): Promise<EquitySecurity[]> {
    this.logger.log(`Screening stocks by growth: revenue ${minRevenueGrowth}%, EPS ${minEPSGrowth}%`);
    try {
      const results = await screenByGrowth(minRevenueGrowth, minEPSGrowth);
      this.logger.log(`Found ${results.length} growth stocks`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to screen by growth: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to screen stocks by growth metrics');
    }
  }

  /**
   * Screen dividend-paying stocks
   */
  async screenDividendStocksService(
    minYield: number,
    minConsecutiveYears: number
  ): Promise<EquitySecurity[]> {
    this.logger.log(`Screening dividend stocks: yield ${minYield}%, years ${minConsecutiveYears}`);
    try {
      const results = await screenDividendStocks(minYield, minConsecutiveYears);
      this.logger.log(`Found ${results.length} dividend stocks`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to screen dividend stocks: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to screen dividend stocks');
    }
  }

  /**
   * Screen value stocks using Benjamin Graham criteria
   */
  async screenValueStocksService(): Promise<EquitySecurity[]> {
    this.logger.log('Screening value stocks using Graham criteria');
    try {
      const results = await screenValueStocks();
      this.logger.log(`Found ${results.length} value stocks`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to screen value stocks: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to screen value stocks');
    }
  }

  /**
   * Get securities by sector and industry
   */
  async getSecuritiesBySectorIndustryService(
    sector: string,
    industry?: string
  ): Promise<EquitySecurity[]> {
    this.logger.log(`Getting securities for sector ${sector}, industry ${industry || 'all'}`);
    try {
      const results = await getSecuritiesBySectorIndustry(sector, industry);
      this.logger.log(`Found ${results.length} securities`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to get securities: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve securities by sector/industry');
    }
  }

  /**
   * Get securities by market cap category
   */
  async getSecuritiesByMarketCapService(
    category: MarketCapCategory
  ): Promise<EquitySecurity[]> {
    this.logger.log(`Getting securities for market cap category ${category}`);
    try {
      const results = await getSecuritiesByMarketCap(category);
      this.logger.log(`Found ${results.length} securities`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to get securities by market cap: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve securities by market cap');
    }
  }

  /**
   * Compare security to peer group
   */
  async compareSecurityToPeers(securityId: string): Promise<any> {
    this.logger.log(`Comparing security ${securityId} to peers`);
    try {
      const comparison = await compareToPeers(securityId);
      this.logger.log(`Peer comparison completed for ${securityId}`);
      return comparison;
    } catch (error) {
      this.logger.error(`Failed to compare to peers: ${error.message}`, error.stack);
      throw new NotFoundException('Security not found or comparison failed');
    }
  }

  /**
   * Get peer group for a security
   */
  async getPeerGroupService(securityId: string): Promise<EquitySecurity[]> {
    this.logger.log(`Getting peer group for security ${securityId}`);
    try {
      const peers = await getPeerGroup(securityId);
      this.logger.log(`Found ${peers.length} peers for ${securityId}`);
      return peers;
    } catch (error) {
      this.logger.error(`Failed to get peer group: ${error.message}`, error.stack);
      throw new NotFoundException('Security not found or peer group unavailable');
    }
  }

  /**
   * Run comprehensive multi-criteria screen
   */
  async runComprehensiveScreen(criteria: ScreeningCriteriaDto): Promise<ScreenResultDto[]> {
    this.logger.log('Running comprehensive stock screen');
    try {
      let results: EquitySecurity[] = [];

      // Start with valuation screen if criteria provided
      if (criteria.maxPE || criteria.maxPB || criteria.minDividendYield || criteria.minMarketCap || criteria.maxMarketCap) {
        results = await screenByValuation(criteria);
      }

      // Filter by growth if criteria provided
      if (criteria.minRevenueGrowth !== undefined && criteria.minEPSGrowth !== undefined) {
        const growthResults = await screenByGrowth(criteria.minRevenueGrowth, criteria.minEPSGrowth);
        if (results.length > 0) {
          // Intersect results
          const growthIds = new Set(growthResults.map(s => s.id));
          results = results.filter(s => growthIds.has(s.id));
        } else {
          results = growthResults;
        }
      }

      // Filter by sector/industry if provided
      if (criteria.sector) {
        if (results.length > 0) {
          results = results.filter(s => s.sector === criteria.sector && (!criteria.industry || s.industry === criteria.industry));
        } else {
          results = await getSecuritiesBySectorIndustry(criteria.sector, criteria.industry);
        }
      }

      // Filter by market cap category if provided
      if (criteria.marketCapCategory) {
        if (results.length > 0) {
          results = results.filter(s => s.marketCapCategory === criteria.marketCapCategory);
        } else {
          results = await getSecuritiesByMarketCap(criteria.marketCapCategory);
        }
      }

      // Map to DTOs with valuation data
      const screenResults: ScreenResultDto[] = await Promise.all(
        results.map(async (security) => {
          const valuation = await getLatestValuation(security.id);
          return {
            symbol: security.symbol,
            name: security.name,
            sector: security.sector,
            industry: security.industry,
            marketCapCategory: security.marketCapCategory,
            currentPrice: valuation ? Number(valuation.stockPrice) : 0,
            marketCap: valuation ? Number(valuation.marketCap) : 0,
            peRatio: valuation ? Number(valuation.peRatio) : null,
            pbRatio: valuation ? Number(valuation.pbRatio) : null,
            dividendYield: valuation ? Number(valuation.dividendYield) : null,
            epsGrowth: valuation ? Number(valuation.epsGrowth) : null,
            tradingStatus: security.tradingStatus,
          };
        })
      );

      this.logger.log(`Comprehensive screen returned ${screenResults.length} results`);
      return screenResults;
    } catch (error) {
      this.logger.error(`Failed to run comprehensive screen: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to run comprehensive stock screen');
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Stock Screening Systems')
@Controller('stock-screening')
export class StockScreeningController {
  private readonly logger = new Logger(StockScreeningController.name);

  constructor(private readonly screeningService: StockScreeningService) {}

  @Post('screen/valuation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Screen stocks by valuation criteria',
    description: 'Filter stocks based on P/E, P/B, dividend yield, and market cap criteria',
  })
  @ApiBody({ type: ScreeningCriteriaDto })
  @ApiResponse({
    status: 200,
    description: 'Screening results returned successfully',
    type: [ScreenResultDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid screening criteria' })
  async screenByValuation(@Body() criteria: ScreeningCriteriaDto): Promise<EquitySecurity[]> {
    this.logger.log('POST /stock-screening/screen/valuation');
    return await this.screeningService.screenByValuationCriteria(criteria);
  }

  @Get('screen/growth')
  @ApiOperation({
    summary: 'Screen stocks by growth metrics',
    description: 'Filter stocks based on revenue and earnings growth rates',
  })
  @ApiQuery({ name: 'minRevenueGrowth', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'minEPSGrowth', required: true, type: Number, example: 15 })
  @ApiResponse({
    status: 200,
    description: 'Growth stocks returned successfully',
    type: [ScreenResultDto],
  })
  async screenByGrowth(
    @Query('minRevenueGrowth') minRevenueGrowth: string,
    @Query('minEPSGrowth') minEPSGrowth: string
  ): Promise<EquitySecurity[]> {
    this.logger.log('GET /stock-screening/screen/growth');
    return await this.screeningService.screenByGrowthMetrics(
      parseFloat(minRevenueGrowth),
      parseFloat(minEPSGrowth)
    );
  }

  @Get('screen/dividend')
  @ApiOperation({
    summary: 'Screen dividend-paying stocks',
    description: 'Filter stocks with consistent dividend history and minimum yield',
  })
  @ApiQuery({ name: 'minYield', required: true, type: Number, example: 3.0 })
  @ApiQuery({ name: 'minYears', required: true, type: Number, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Dividend stocks returned successfully',
    type: [ScreenResultDto],
  })
  async screenDividend(
    @Query('minYield') minYield: string,
    @Query('minYears') minYears: string
  ): Promise<EquitySecurity[]> {
    this.logger.log('GET /stock-screening/screen/dividend');
    return await this.screeningService.screenDividendStocksService(
      parseFloat(minYield),
      parseInt(minYears, 10)
    );
  }

  @Get('screen/value')
  @ApiOperation({
    summary: 'Screen value stocks',
    description: 'Filter stocks using Benjamin Graham value investing criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'Value stocks returned successfully',
    type: [ScreenResultDto],
  })
  async screenValue(): Promise<EquitySecurity[]> {
    this.logger.log('GET /stock-screening/screen/value');
    return await this.screeningService.screenValueStocksService();
  }

  @Post('screen/comprehensive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Run comprehensive multi-criteria stock screen',
    description: 'Apply multiple screening criteria simultaneously for refined results',
  })
  @ApiBody({ type: ScreeningCriteriaDto })
  @ApiResponse({
    status: 200,
    description: 'Comprehensive screening results returned',
    type: [ScreenResultDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid screening criteria' })
  async comprehensiveScreen(@Body() criteria: ScreeningCriteriaDto): Promise<ScreenResultDto[]> {
    this.logger.log('POST /stock-screening/screen/comprehensive');
    return await this.screeningService.runComprehensiveScreen(criteria);
  }

  @Get('sector/:sector')
  @ApiOperation({
    summary: 'Get securities by sector',
    description: 'Retrieve all securities in a specific sector, optionally filtered by industry',
  })
  @ApiParam({ name: 'sector', required: true, example: 'Technology' })
  @ApiQuery({ name: 'industry', required: false, example: 'Software' })
  @ApiResponse({
    status: 200,
    description: 'Securities returned successfully',
    type: [ScreenResultDto],
  })
  async getSecuritiesBySector(
    @Param('sector') sector: string,
    @Query('industry') industry?: string
  ): Promise<EquitySecurity[]> {
    this.logger.log(`GET /stock-screening/sector/${sector}`);
    return await this.screeningService.getSecuritiesBySectorIndustryService(sector, industry);
  }

  @Get('marketcap/:category')
  @ApiOperation({
    summary: 'Get securities by market cap category',
    description: 'Retrieve all securities in a specific market capitalization range',
  })
  @ApiParam({ name: 'category', required: true, enum: MarketCapCategory, example: 'large_cap' })
  @ApiResponse({
    status: 200,
    description: 'Securities returned successfully',
    type: [ScreenResultDto],
  })
  async getSecuritiesByMarketCap(
    @Param('category') category: MarketCapCategory
  ): Promise<EquitySecurity[]> {
    this.logger.log(`GET /stock-screening/marketcap/${category}`);
    return await this.screeningService.getSecuritiesByMarketCapService(category);
  }

  @Get('peer-comparison/:securityId')
  @ApiOperation({
    summary: 'Compare security to peer group',
    description: 'Analyze how a security performs relative to its industry peers',
  })
  @ApiParam({ name: 'securityId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Peer comparison data returned successfully',
    type: PeerComparisonDto,
  })
  @ApiResponse({ status: 404, description: 'Security not found' })
  async compareToPeers(@Param('securityId') securityId: string): Promise<any> {
    this.logger.log(`GET /stock-screening/peer-comparison/${securityId}`);
    return await this.screeningService.compareSecurityToPeers(securityId);
  }

  @Get('peers/:securityId')
  @ApiOperation({
    summary: 'Get peer group for a security',
    description: 'Retrieve the peer group securities for comparison analysis',
  })
  @ApiParam({ name: 'securityId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Peer group returned successfully',
    type: [ScreenResultDto],
  })
  @ApiResponse({ status: 404, description: 'Security not found' })
  async getPeerGroup(@Param('securityId') securityId: string): Promise<EquitySecurity[]> {
    this.logger.log(`GET /stock-screening/peers/${securityId}`);
    return await this.screeningService.getPeerGroupService(securityId);
  }
}

// ============================================================================
// REACT COMPONENTS
// ============================================================================

/**
 * Stock Screening Dashboard Component
 */
interface StockScreeningDashboardProps {
  userId: string;
  apiBaseUrl: string;
}

export const StockScreeningDashboard: React.FC<StockScreeningDashboardProps> = ({
  userId,
  apiBaseUrl,
}) => {
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteriaDto>({});
  const [screenResults, setScreenResults] = useState<ScreenResultDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'valuation' | 'growth' | 'dividend' | 'value' | 'comprehensive'>('comprehensive');

  /**
   * Run comprehensive screen
   */
  const runScreen = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/stock-screening/screen/comprehensive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(screeningCriteria),
      });
      if (!response.ok) throw new Error('Failed to run screen');
      const data = await response.json();
      setScreenResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [screeningCriteria, apiBaseUrl]);

  /**
   * Run value screen
   */
  const runValueScreen = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/stock-screening/screen/value`);
      if (!response.ok) throw new Error('Failed to run value screen');
      const data = await response.json();
      // Map to ScreenResultDto format
      setScreenResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  /**
   * Update criteria field
   */
  const updateCriteria = (field: string, value: any) => {
    setScreeningCriteria(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="stock-screening-dashboard">
      <div className="dashboard-header">
        <h1>Bloomberg Terminal Stock Screening System</h1>
        <p>Advanced equity filtering and peer analysis</p>
      </div>

      <div className="screening-tabs">
        <button
          className={activeTab === 'comprehensive' ? 'active' : ''}
          onClick={() => setActiveTab('comprehensive')}
        >
          Comprehensive
        </button>
        <button
          className={activeTab === 'valuation' ? 'active' : ''}
          onClick={() => setActiveTab('valuation')}
        >
          Valuation
        </button>
        <button
          className={activeTab === 'growth' ? 'active' : ''}
          onClick={() => setActiveTab('growth')}
        >
          Growth
        </button>
        <button
          className={activeTab === 'dividend' ? 'active' : ''}
          onClick={() => setActiveTab('dividend')}
        >
          Dividend
        </button>
        <button
          className={activeTab === 'value' ? 'active' : ''}
          onClick={() => setActiveTab('value')}
        >
          Value
        </button>
      </div>

      <div className="screening-criteria">
        <h2>Screening Criteria</h2>
        <div className="criteria-grid">
          <div className="criteria-field">
            <label>Max P/E Ratio:</label>
            <input
              type="number"
              value={screeningCriteria.maxPE || ''}
              onChange={(e) => updateCriteria('maxPE', parseFloat(e.target.value))}
              placeholder="15"
            />
          </div>
          <div className="criteria-field">
            <label>Max P/B Ratio:</label>
            <input
              type="number"
              value={screeningCriteria.maxPB || ''}
              onChange={(e) => updateCriteria('maxPB', parseFloat(e.target.value))}
              placeholder="1.5"
            />
          </div>
          <div className="criteria-field">
            <label>Min Dividend Yield (%):</label>
            <input
              type="number"
              value={screeningCriteria.minDividendYield || ''}
              onChange={(e) => updateCriteria('minDividendYield', parseFloat(e.target.value))}
              placeholder="3.0"
            />
          </div>
          <div className="criteria-field">
            <label>Min Revenue Growth (%):</label>
            <input
              type="number"
              value={screeningCriteria.minRevenueGrowth || ''}
              onChange={(e) => updateCriteria('minRevenueGrowth', parseFloat(e.target.value))}
              placeholder="10"
            />
          </div>
          <div className="criteria-field">
            <label>Min EPS Growth (%):</label>
            <input
              type="number"
              value={screeningCriteria.minEPSGrowth || ''}
              onChange={(e) => updateCriteria('minEPSGrowth', parseFloat(e.target.value))}
              placeholder="15"
            />
          </div>
          <div className="criteria-field">
            <label>Sector:</label>
            <input
              type="text"
              value={screeningCriteria.sector || ''}
              onChange={(e) => updateCriteria('sector', e.target.value)}
              placeholder="Technology"
            />
          </div>
        </div>
        <div className="criteria-actions">
          <button onClick={runScreen} disabled={loading}>
            {loading ? 'Screening...' : 'Run Screen'}
          </button>
          <button onClick={runValueScreen} disabled={loading}>
            Run Value Screen
          </button>
          <button onClick={() => setScreeningCriteria({})}>Clear Criteria</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="screen-results">
        <h2>Screen Results ({screenResults.length} stocks)</h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Sector</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>P/E</th>
              <th>P/B</th>
              <th>Div Yield</th>
              <th>EPS Growth</th>
            </tr>
          </thead>
          <tbody>
            {screenResults.map((result, index) => (
              <tr key={index}>
                <td>{result.symbol}</td>
                <td>{result.name}</td>
                <td>{result.sector}</td>
                <td>${result.currentPrice.toFixed(2)}</td>
                <td>${(result.marketCap / 1e9).toFixed(2)}B</td>
                <td>{result.peRatio?.toFixed(2) || 'N/A'}</td>
                <td>{result.pbRatio?.toFixed(2) || 'N/A'}</td>
                <td>{result.dividendYield?.toFixed(2) || 'N/A'}%</td>
                <td>{result.epsGrowth?.toFixed(2) || 'N/A'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Module exports
 */
export {
  StockScreeningService,
  StockScreeningController,
  ScreeningCriteriaDto,
  ScreenResultDto,
  PeerComparisonDto,
};
