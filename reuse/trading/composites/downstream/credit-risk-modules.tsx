/**
 * LOC: WC-DOWNSTREAM-CREDIT-MOD-007
 * File: /reuse/trading/composites/downstream/credit-risk-modules.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface CreditMetrics {
  portfolioValue: number;
  totalExposure: number;
  expectedLoss: number;
  unexpectedLoss: number;
  economicCapital: number;
  concentrationRisk: number;
}

@Controller('api/v1/credit/modules')
@ApiTags('Credit Risk Modules')
@ApiBearerAuth()
@Injectable()
export class CreditRiskModulesController {
  private readonly logger = new Logger(CreditRiskModulesController.name);

  @Get('metrics')
  @ApiOperation({ summary: 'Get portfolio credit metrics' })
  async getMetrics(): Promise<CreditMetrics> {
    return {
      portfolioValue: 500000000,
      totalExposure: 350000000,
      expectedLoss: 5250000,
      unexpectedLoss: 18500000,
      economicCapital: 25000000,
      concentrationRisk: 0.35,
    };
  }

  @Post('stress-test')
  @ApiOperation({ summary: 'Run credit stress test' })
  async runStressTest(@Body() params: { scenario: string }): Promise<{
    scenario: string;
    baselineLoss: number;
    stressedLoss: number;
    impact: number;
  }> {
    const baselineLoss = 5250000;
    const stressedLoss = baselineLoss * (1 + Math.random() * 2);
    return {
      scenario: params.scenario,
      baselineLoss,
      stressedLoss,
      impact: stressedLoss - baselineLoss,
    };
  }

  @Get('portfolio/concentration')
  @ApiOperation({ summary: 'Get concentration risk analysis' })
  async getConcentration(): Promise<Array<{
    sector: string;
    exposure: number;
    percentage: number;
  }>> {
    return [
      { sector: 'Financials', exposure: 120000000, percentage: 34.3 },
      { sector: 'Technology', exposure: 85000000, percentage: 24.3 },
      { sector: 'Healthcare', exposure: 65000000, percentage: 18.6 },
      { sector: 'Energy', exposure: 50000000, percentage: 14.3 },
      { sector: 'Others', exposure: 30000000, percentage: 8.5 },
    ];
  }
}

export function CreditRiskModulesDashboard() {
  const [metrics, setMetrics] = useState<CreditMetrics | null>(null);
  const [concentration, setConcentration] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/credit/modules/metrics').then(r => r.json()),
      fetch('/api/v1/credit/modules/portfolio/concentration').then(r => r.json()),
    ]).then(([m, c]) => {
      setMetrics(m);
      setConcentration(c);
    });
  }, []);

  if (!metrics) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Credit Risk Analytics</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Expected Loss</h3>
          <p className="text-2xl font-bold">${(metrics.expectedLoss / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Economic Capital</h3>
          <p className="text-2xl font-bold">${(metrics.economicCapital / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Concentration Risk</h3>
          <p className="text-2xl font-bold">{(metrics.concentrationRisk * 100).toFixed(1)}%</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sector Concentration</h2>
        {concentration.map((s) => (
          <div key={s.sector} className="mb-3">
            <div className="flex justify-between mb-1">
              <span>{s.sector}</span>
              <span>{s.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${s.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CreditRiskModulesController, CreditRiskModulesDashboard };
