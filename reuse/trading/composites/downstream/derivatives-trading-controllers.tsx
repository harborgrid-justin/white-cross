/**
 * LOC: WC-DOWNSTREAM-DERIV-CTL-009
 * File: /reuse/trading/composites/downstream/derivatives-trading-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export enum DerivativeType {
  OPTION = 'option',
  FUTURE = 'future',
  SWAP = 'swap',
  FORWARD = 'forward',
  CDS = 'cds',
}

export interface DerivativePosition {
  id: string;
  instrumentType: DerivativeType;
  underlying: string;
  quantity: number;
  strike?: number;
  expiry: Date;
  currentPrice: number;
  markToMarket: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
}

@Controller('api/v1/derivatives')
@ApiTags('Derivatives Trading')
@ApiBearerAuth()
@Injectable()
export class DerivativesTradingController {
  private readonly logger = new Logger(DerivativesTradingController.name);

  @Get('positions')
  @ApiOperation({ summary: 'Get derivative positions' })
  async getPositions(@Query('type') type?: DerivativeType): Promise<DerivativePosition[]> {
    const positions: DerivativePosition[] = [];
    for (let i = 0; i < 15; i++) {
      positions.push({
        id: `DERIV-${i}`,
        instrumentType: type || Object.values(DerivativeType)[i % 5],
        underlying: ['SPY', 'AAPL', 'MSFT', 'GOOGL'][i % 4],
        quantity: Math.floor(Math.random() * 100) + 10,
        strike: Math.random() > 0.5 ? 100 + Math.random() * 50 : undefined,
        expiry: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
        currentPrice: 100 + Math.random() * 50,
        markToMarket: (Math.random() - 0.5) * 100000,
        delta: Math.random() - 0.5,
        gamma: Math.random() * 0.1,
        vega: Math.random() * 10,
        theta: -Math.random() * 5,
      });
    }
    return positions;
  }

  @Post('price')
  @ApiOperation({ summary: 'Price derivative instrument' })
  async priceDerivative(@Body() params: {
    instrumentType: DerivativeType;
    underlying: string;
    strike?: number;
    expiry: Date;
    volatility: number;
  }): Promise<{
    fairValue: number;
    greeks: { delta: number; gamma: number; vega: number; theta: number; rho: number };
  }> {
    return {
      fairValue: 5.25 + Math.random() * 10,
      greeks: {
        delta: Math.random() - 0.5,
        gamma: Math.random() * 0.1,
        vega: Math.random() * 10,
        theta: -Math.random() * 5,
        rho: Math.random() * 2,
      },
    };
  }

  @Get('risk/portfolio')
  @ApiOperation({ summary: 'Get portfolio Greeks' })
  async getPortfolioGreeks(): Promise<{
    totalDelta: number;
    totalGamma: number;
    totalVega: number;
    totalTheta: number;
    var95: number;
  }> {
    return {
      totalDelta: (Math.random() - 0.5) * 1000,
      totalGamma: Math.random() * 50,
      totalVega: Math.random() * 500,
      totalTheta: -Math.random() * 200,
      var95: Math.random() * 500000,
    };
  }
}

export function DerivativesTradingDashboard() {
  const [positions, setPositions] = useState<DerivativePosition[]>([]);
  const [greeks, setGreeks] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/derivatives/positions').then(r => r.json()),
      fetch('/api/v1/derivatives/risk/portfolio').then(r => r.json()),
    ]).then(([pos, grk]) => {
      setPositions(pos);
      setGreeks(grk);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Derivatives Trading</h1>
      {greeks && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">Delta</h3>
            <p className="text-xl font-bold">{greeks.totalDelta.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">Gamma</h3>
            <p className="text-xl font-bold">{greeks.totalGamma.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">Vega</h3>
            <p className="text-xl font-bold">{greeks.totalVega.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">Theta</h3>
            <p className="text-xl font-bold">{greeks.totalTheta.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">VaR 95%</h3>
            <p className="text-xl font-bold">${(greeks.var95 / 1000).toFixed(0)}K</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Underlying</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MtM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {positions.map((pos) => (
              <tr key={pos.id}>
                <td className="px-6 py-4 text-sm">{pos.instrumentType.toUpperCase()}</td>
                <td className="px-6 py-4 text-sm">{pos.underlying}</td>
                <td className="px-6 py-4 text-sm">{pos.quantity}</td>
                <td className={`px-6 py-4 text-sm ${pos.markToMarket >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${pos.markToMarket.toFixed(0)}
                </td>
                <td className="px-6 py-4 text-sm">{pos.delta.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DerivativesTradingController, DerivativesTradingDashboard };
