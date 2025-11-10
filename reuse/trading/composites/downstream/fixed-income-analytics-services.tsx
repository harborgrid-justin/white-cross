/**
 * LOC: WC-DOWNSTREAM-FI-ANAL-015
 * File: /reuse/trading/composites/downstream/fixed-income-analytics-services.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface BondAnalytics {
  cusip: string;
  isin: string;
  price: number;
  yield: number;
  duration: number;
  convexity: number;
  spread: number;
  zSpread: number;
}

export interface YieldCurvePoint {
  maturity: number;
  yield: number;
}

@Controller('api/v1/fixed-income/analytics')
@ApiTags('Fixed Income Analytics')
@ApiBearerAuth()
@Injectable()
export class FixedIncomeAnalyticsController {
  private readonly logger = new Logger(FixedIncomeAnalyticsController.name);

  @Get('bond/:cusip/analytics')
  @ApiOperation({ summary: 'Get bond analytics' })
  async getBondAnalytics(@Param('cusip') cusip: string): Promise<BondAnalytics> {
    return {
      cusip,
      isin: `US${cusip.substring(0, 9)}`,
      price: 98 + Math.random() * 4,
      yield: 0.03 + Math.random() * 0.02,
      duration: 5 + Math.random() * 5,
      convexity: 20 + Math.random() * 30,
      spread: 50 + Math.random() * 100,
      zSpread: 55 + Math.random() * 105,
    };
  }

  @Get('yield-curve')
  @ApiOperation({ summary: 'Get yield curve' })
  async getYieldCurve(): Promise<YieldCurvePoint[]> {
    const maturities = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
    return maturities.map((maturity) => ({
      maturity,
      yield: 0.03 + maturity * 0.001 + Math.random() * 0.005,
    }));
  }

  @Post('price')
  @ApiOperation({ summary: 'Price bond' })
  async priceBond(@Body() params: {
    faceValue: number;
    couponRate: number;
    maturity: number;
    yieldToMaturity: number;
  }): Promise<{ price: number; duration: number; convexity: number }> {
    const price = 95 + Math.random() * 10;
    return {
      price,
      duration: params.maturity * 0.8,
      convexity: params.maturity * params.maturity * 0.5,
    };
  }
}

export function FixedIncomeAnalyticsDashboard() {
  const [curve, setCurve] = useState<YieldCurvePoint[]>([]);

  useEffect(() => {
    fetch('/api/v1/fixed-income/analytics/yield-curve')
      .then(r => r.json())
      .then(setCurve);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fixed Income Analytics</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Yield Curve</h2>
        <div className="space-y-2">
          {curve.map((point) => (
            <div key={point.maturity} className="flex justify-between p-2 bg-gray-50 rounded">
              <span>{point.maturity}Y</span>
              <span>{(point.yield * 100).toFixed(3)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { FixedIncomeAnalyticsController, FixedIncomeAnalyticsDashboard };
