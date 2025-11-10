/**
 * LOC: WC-DOWNSTREAM-LIQ-PROV-019
 * File: /reuse/trading/composites/downstream/liquidity-provision-services.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Put, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface LiquidityPool {
  id: string;
  symbol: string;
  bidSize: number;
  askSize: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  volume24h: number;
  tvl: number;
}

export interface MarketMakingStrategy {
  id: string;
  symbol: string;
  minSpread: number;
  maxSpread: number;
  targetInventory: number;
  currentInventory: number;
  pnl24h: number;
  status: 'active' | 'paused';
}

@Controller('api/v1/liquidity')
@ApiTags('Liquidity Provision')
@ApiBearerAuth()
@Injectable()
export class LiquidityProvisionController {
  private readonly logger = new Logger(LiquidityProvisionController.name);

  @Get('pools')
  @ApiOperation({ summary: 'Get liquidity pools' })
  async getPools(): Promise<LiquidityPool[]> {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    return symbols.map((symbol) => {
      const mid = 150 + Math.random() * 50;
      const spread = 0.01 + Math.random() * 0.05;
      return {
        id: `POOL-${symbol}`,
        symbol,
        bidSize: Math.floor(Math.random() * 10000) + 1000,
        askSize: Math.floor(Math.random() * 10000) + 1000,
        bidPrice: mid - spread / 2,
        askPrice: mid + spread / 2,
        spread: spread / mid,
        volume24h: Math.floor(Math.random() * 10000000),
        tvl: Math.floor(Math.random() * 50000000) + 10000000,
      };
    });
  }

  @Get('strategies')
  @ApiOperation({ summary: 'Get market making strategies' })
  async getStrategies(): Promise<MarketMakingStrategy[]> {
    return [
      {
        id: 'MM-1',
        symbol: 'AAPL',
        minSpread: 0.01,
        maxSpread: 0.05,
        targetInventory: 5000,
        currentInventory: 4850,
        pnl24h: 12500,
        status: 'active',
      },
      {
        id: 'MM-2',
        symbol: 'MSFT',
        minSpread: 0.01,
        maxSpread: 0.04,
        targetInventory: 3000,
        currentInventory: 3100,
        pnl24h: 8200,
        status: 'active',
      },
    ];
  }

  @Post('strategies')
  @ApiOperation({ summary: 'Create market making strategy' })
  async createStrategy(@Body() params: {
    symbol: string;
    minSpread: number;
    maxSpread: number;
    targetInventory: number;
  }): Promise<MarketMakingStrategy> {
    return {
      id: `MM-${Date.now()}`,
      ...params,
      currentInventory: 0,
      pnl24h: 0,
      status: 'active',
    };
  }

  @Put('strategies/:id/pause')
  @ApiOperation({ summary: 'Pause strategy' })
  async pauseStrategy(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.log(`Paused strategy ${id}`);
    return { success: true };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get liquidity metrics' })
  async getMetrics(): Promise<{
    totalVolume24h: number;
    totalPnL24h: number;
    activeStrategies: number;
    avgSpread: number;
  }> {
    return {
      totalVolume24h: 25000000,
      totalPnL24h: 45000,
      activeStrategies: 12,
      avgSpread: 0.025,
    };
  }
}

export function LiquidityProvisionDashboard() {
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [strategies, setStrategies] = useState<MarketMakingStrategy[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/liquidity/pools').then(r => r.json()),
      fetch('/api/v1/liquidity/strategies').then(r => r.json()),
      fetch('/api/v1/liquidity/metrics').then(r => r.json()),
    ]).then(([p, s, m]) => {
      setPools(p);
      setStrategies(s);
      setMetrics(m);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Liquidity Provision</h1>
      {metrics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">24h Volume</h3>
            <p className="text-2xl font-bold">${(metrics.totalVolume24h / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">24h P&L</h3>
            <p className="text-2xl font-bold text-green-600">${(metrics.totalPnL24h / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Active Strategies</h3>
            <p className="text-2xl font-bold">{metrics.activeStrategies}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Avg Spread</h3>
            <p className="text-2xl font-bold">{(metrics.avgSpread * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Liquidity Pools</h2>
          <div className="space-y-2">
            {pools.map((pool) => (
              <div key={pool.id} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{pool.symbol}</span>
                  <span className="text-sm">{(pool.spread * 100).toFixed(3)}% spread</span>
                </div>
                <div className="text-sm text-gray-600">
                  TVL: ${(pool.tvl / 1000000).toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Market Making Strategies</h2>
          <div className="space-y-2">
            {strategies.map((strat) => (
              <div key={strat.id} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{strat.symbol}</span>
                  <span className={`text-sm ${strat.pnl24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${strat.pnl24h.toFixed(0)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Inventory: {strat.currentInventory} / {strat.targetInventory}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LiquidityProvisionController, LiquidityProvisionDashboard };
