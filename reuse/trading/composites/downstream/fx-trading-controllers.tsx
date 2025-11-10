/**
 * LOC: WC-DOWNSTREAM-FX-CTL-013
 * File: /reuse/trading/composites/downstream/fx-trading-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface FXRate {
  pair: string;
  bid: number;
  ask: number;
  mid: number;
  spread: number;
  change24h: number;
}

export interface FXPosition {
  pair: string;
  quantity: number;
  avgRate: number;
  currentRate: number;
  unrealizedPnL: number;
}

@Controller('api/v1/fx')
@ApiTags('FX Trading')
@ApiBearerAuth()
@Injectable()
export class FXTradingController {
  private readonly logger = new Logger(FXTradingController.name);

  @Get('rates')
  @ApiOperation({ summary: 'Get FX rates' })
  async getRates(): Promise<FXRate[]> {
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'];
    return pairs.map((pair) => {
      const mid = 1.0 + Math.random() * 0.2;
      const spread = 0.0001 + Math.random() * 0.0005;
      return {
        pair,
        bid: mid - spread / 2,
        ask: mid + spread / 2,
        mid,
        spread,
        change24h: (Math.random() - 0.5) * 0.02,
      };
    });
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place FX order' })
  async placeOrder(@Body() params: { pair: string; side: 'buy' | 'sell'; quantity: number }): Promise<any> {
    return {
      orderId: `FX-${Date.now()}`,
      pair: params.pair,
      side: params.side,
      quantity: params.quantity,
      status: 'executed',
      rate: 1.05 + Math.random() * 0.1,
    };
  }

  @Get('positions')
  @ApiOperation({ summary: 'Get FX positions' })
  async getPositions(): Promise<FXPosition[]> {
    return [
      { pair: 'EUR/USD', quantity: 100000, avgRate: 1.0850, currentRate: 1.0920, unrealizedPnL: 700 },
      { pair: 'GBP/USD', quantity: -50000, avgRate: 1.2640, currentRate: 1.2590, unrealizedPnL: 250 },
    ];
  }
}

export function FXTradingDashboard() {
  const [rates, setRates] = useState<FXRate[]>([]);
  const [positions, setPositions] = useState<FXPosition[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/fx/rates').then(r => r.json()),
      fetch('/api/v1/fx/positions').then(r => r.json()),
    ]).then(([r, p]) => {
      setRates(r);
      setPositions(p);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">FX Trading</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Live Rates</h2>
          <div className="space-y-2">
            {rates.map((rate) => (
              <div key={rate.pair} className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{rate.pair}</span>
                <span>{rate.mid.toFixed(4)}</span>
                <span className={rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {(rate.change24h * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Positions</h2>
          <div className="space-y-2">
            {positions.map((pos) => (
              <div key={pos.pair} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{pos.pair}</span>
                  <span className={pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${pos.unrealizedPnL.toFixed(0)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {pos.quantity > 0 ? 'Long' : 'Short'} {Math.abs(pos.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { FXTradingController, FXTradingDashboard };
