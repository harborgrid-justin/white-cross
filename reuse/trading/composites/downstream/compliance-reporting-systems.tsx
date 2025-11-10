/**
 * LOC: WC-DOWNSTREAM-COMPLY-REP-003
 * File: /reuse/trading/composites/downstream/compliance-reporting-systems.tsx
 *
 * UPSTREAM (imports from):
 *   - ../risk-management-analytics-composite
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - react (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Risk reporting dashboards
 *   - Compliance analytics interfaces
 *   - Regulatory submission systems
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export enum ReportCategory {
  MARKET_RISK = 'market_risk',
  CREDIT_RISK = 'credit_risk',
  OPERATIONAL_RISK = 'operational_risk',
  LIQUIDITY_RISK = 'liquidity_risk',
  COMPLIANCE = 'compliance',
}

export enum RiskMetricType {
  VAR = 'var',
  EXPECTED_SHORTFALL = 'expected_shortfall',
  STRESS_TEST = 'stress_test',
  SCENARIO_ANALYSIS = 'scenario_analysis',
  CONCENTRATION_RISK = 'concentration_risk',
}

export interface RiskReport {
  id: string;
  category: ReportCategory;
  generatedAt: Date;
  period: { start: Date; end: Date };
  metrics: {
    type: RiskMetricType;
    value: number;
    threshold: number;
    status: 'normal' | 'warning' | 'breach';
  }[];
  summary: string;
  recommendations: string[];
}

@Controller('api/v1/compliance/reporting')
@ApiTags('Compliance Reporting')
@ApiBearerAuth()
@Injectable()
export class ComplianceReportingController {
  private readonly logger = new Logger(ComplianceReportingController.name);

  @Get('risk-reports')
  @ApiOperation({ summary: 'Get risk compliance reports' })
  @ApiResponse({ status: 200, description: 'Reports retrieved' })
  async getRiskReports(@Query('category') category?: ReportCategory): Promise<RiskReport[]> {
    this.logger.log(`Fetching risk reports for category: ${category}`);

    const reports: RiskReport[] = [];
    for (let i = 0; i < 10; i++) {
      reports.push({
        id: `RISK-RPT-${Date.now()}-${i}`,
        category: category || ReportCategory.MARKET_RISK,
        generatedAt: new Date(),
        period: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
        },
        metrics: [
          {
            type: RiskMetricType.VAR,
            value: Math.random() * 10000000,
            threshold: 15000000,
            status: Math.random() > 0.8 ? 'warning' : 'normal',
          },
          {
            type: RiskMetricType.EXPECTED_SHORTFALL,
            value: Math.random() * 12000000,
            threshold: 18000000,
            status: 'normal',
          },
        ],
        summary: 'Portfolio risk within acceptable limits',
        recommendations: ['Continue monitoring', 'Review concentration limits'],
      });
    }

    return reports;
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate new compliance report' })
  @ApiResponse({ status: 201, description: 'Report generated' })
  @HttpCode(HttpStatus.CREATED)
  async generateReport(
    @Body() params: {
      category: ReportCategory;
      startDate: Date;
      endDate: Date;
      includeStressTests: boolean;
    }
  ): Promise<RiskReport> {
    this.logger.log(`Generating ${params.category} report`);

    return {
      id: `RISK-RPT-${Date.now()}`,
      category: params.category,
      generatedAt: new Date(),
      period: {
        start: new Date(params.startDate),
        end: new Date(params.endDate),
      },
      metrics: [
        {
          type: RiskMetricType.VAR,
          value: 8500000,
          threshold: 15000000,
          status: 'normal',
        },
        {
          type: RiskMetricType.STRESS_TEST,
          value: 22000000,
          threshold: 25000000,
          status: 'warning',
        },
      ],
      summary: 'Comprehensive risk analysis completed',
      recommendations: ['Reduce concentration in sector X', 'Increase hedging coverage'],
    };
  }
}

export function ComplianceReportingDashboard() {
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/v1/compliance/reporting/risk-reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Reporting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">{report.category.toUpperCase()}</h3>
            <div className="space-y-3">
              {report.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium">{metric.type.toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    metric.status === 'breach' ? 'bg-red-100 text-red-800' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {metric.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-gray-600">{report.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ComplianceReportingController, ComplianceReportingDashboard };
export type { RiskReport };
