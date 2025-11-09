/**
 * LOC: FINREP001
 * File: /reuse/threat/composites/downstream/financial-reporting-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-metrics-analytics-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CFO dashboards
 *   - Financial planning systems
 *   - Budget allocation tools
 *   - Cost-benefit analysis
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('financial-reporting')
@Controller('api/v1/financial-reporting')
@ApiBearerAuth()
export class FinancialReportingController {
  private readonly logger = new Logger(FinancialReportingController.name);

  constructor(private readonly service: FinancialReportingService) {}

  @Get('security-costs')
  @ApiOperation({ summary: 'Get security program costs' })
  @ApiQuery({ name: 'period', required: false, example: 'quarterly' })
  async getSecurityCosts(@Query('period') period?: string): Promise<any> {
    return this.service.getSecurityProgramCosts(period);
  }

  @Get('incident-costs')
  @ApiOperation({ summary: 'Calculate incident response costs' })
  async getIncidentCosts(): Promise<any> {
    return this.service.calculateIncidentCosts();
  }

  @Post('budget/forecast')
  @ApiOperation({ summary: 'Forecast security budget needs' })
  async forecastBudget(@Body() params: any): Promise<any> {
    return this.service.forecastSecurityBudget(params);
  }

  @Get('roi/analysis')
  @ApiOperation({ summary: 'Get security investment ROI analysis' })
  async getROIAnalysis(): Promise<any> {
    return this.service.getROIAnalysis();
  }
}

@Injectable()
export class FinancialReportingService {
  private readonly logger = new Logger(FinancialReportingService.name);

  async getSecurityProgramCosts(period?: string): Promise<any> {
    return {
      period: period || 'quarterly',
      totalCosts: 1250000,
      breakdown: {
        personnel: 600000,
        tools: 400000,
        training: 100000,
        consulting: 150000,
      },
      vsLastPeriod: '+5%',
    };
  }

  async calculateIncidentCosts(): Promise<any> {
    return {
      totalIncidents: 45,
      totalCosts: 850000,
      avgCostPerIncident: 18889,
      breakdown: {
        detection: 120000,
        containment: 200000,
        recovery: 300000,
        postIncident: 230000,
      },
    };
  }

  async forecastSecurityBudget(params: any): Promise<any> {
    return {
      forecastPeriod: params.period || '2026',
      estimatedBudget: 1500000,
      growthRate: 15,
      justification: [
        'Increased threat landscape',
        'Regulatory compliance',
        'Infrastructure expansion',
      ],
    };
  }

  async getROIAnalysis(): Promise<any> {
    return {
      totalInvestment: 1250000,
      breachesPrevented: 8,
      estimatedAvoidedCosts: 5000000,
      roi: 300,
      paybackPeriod: 6,
    };
  }
}

export default { FinancialReportingController, FinancialReportingService };
