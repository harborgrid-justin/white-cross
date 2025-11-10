/**
 * LOC: WC-DOWNSTREAM-FIN-SCREEN-014
 * File: /reuse/trading/composites/downstream/financial-screening-services.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface ScreeningCriteria {
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  value: number;
}

export interface ScreeningResult {
  symbol: string;
  companyName: string;
  sector: string;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  roe: number;
  debtToEquity: number;
  score: number;
}

@Controller('api/v1/screening')
@ApiTags('Financial Screening')
@ApiBearerAuth()
@Injectable()
export class FinancialScreeningController {
  private readonly logger = new Logger(FinancialScreeningController.name);

  @Post('screen')
  @ApiOperation({ summary: 'Run financial screening' })
  async runScreening(@Body() criteria: ScreeningCriteria[]): Promise<ScreeningResult[]> {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];
    const sectors = ['Technology', 'Consumer', 'Healthcare', 'Finance'];

    return symbols.map((symbol, i) => ({
      symbol,
      companyName: `Company ${symbol}`,
      sector: sectors[i % sectors.length],
      marketCap: 100000000000 + Math.random() * 2000000000000,
      peRatio: 15 + Math.random() * 30,
      dividendYield: Math.random() * 5,
      roe: 10 + Math.random() * 20,
      debtToEquity: Math.random() * 2,
      score: 60 + Math.random() * 40,
    }));
  }

  @Get('presets')
  @ApiOperation({ summary: 'Get screening presets' })
  async getPresets(): Promise<Array<{ id: string; name: string; criteria: ScreeningCriteria[] }>> {
    return [
      { id: 'value', name: 'Value Stocks', criteria: [{ metric: 'peRatio', operator: '<', value: 15 }] },
      { id: 'growth', name: 'Growth Stocks', criteria: [{ metric: 'roe', operator: '>', value: 20 }] },
      { id: 'dividend', name: 'Dividend Stocks', criteria: [{ metric: 'dividendYield', operator: '>', value: 3 }] },
    ];
  }
}

export function FinancialScreeningDashboard() {
  const [results, setResults] = useState<ScreeningResult[]>([]);

  const runScreen = () => {
    fetch('/api/v1/screening/screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ metric: 'peRatio', operator: '<', value: 25 }]),
    })
      .then(r => r.json())
      .then(setResults);
  };

  useEffect(() => {
    runScreen();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Screening</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P/E</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((r) => (
              <tr key={r.symbol}>
                <td className="px-6 py-4 font-medium">{r.symbol}</td>
                <td className="px-6 py-4">{r.sector}</td>
                <td className="px-6 py-4">{r.peRatio.toFixed(1)}</td>
                <td className="px-6 py-4">{r.roe.toFixed(1)}%</td>
                <td className="px-6 py-4">{r.score.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FinancialScreeningController, FinancialScreeningDashboard };
