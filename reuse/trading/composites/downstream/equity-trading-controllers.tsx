/**
 * LOC: WC-DOWNSTREAM-EQUITY-CTL-010
 * File: /reuse/trading/composites/downstream/equity-trading-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface EquityOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  orderType: 'market' | 'limit' | 'stop';
  status: 'pending' | 'filled' | 'partial' | 'cancelled';
  filledQuantity: number;
  avgFillPrice: number;
  createdAt: Date;
}

export interface EquityPosition {
  symbol: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  marketValue: number;
}

@Controller('api/v1/equity')
@ApiTags('Equity Trading')
@ApiBearerAuth()
@Injectable()
export class EquityTradingController {
  private readonly logger = new Logger(EquityTradingController.name);

  @Get('orders')
  @ApiOperation({ summary: 'Get equity orders' })
  async getOrders(@Query('status') status?: string): Promise<EquityOrder[]> {
    const orders: EquityOrder[] = [];
    for (let i = 0; i < 20; i++) {
      const qty = Math.floor(Math.random() * 1000) + 100;
      const filled = Math.floor(qty * Math.random());
      orders.push({
        id: `EQ-${Date.now()}-${i}`,
        symbol: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'][i % 5],
        side: i % 2 === 0 ? 'buy' : 'sell',
        quantity: qty,
        price: 100 + Math.random() * 200,
        orderType: ['market', 'limit', 'stop'][i % 3] as any,
        status: status as any || ['pending', 'filled', 'partial'][i % 3] as any,
        filledQuantity: filled,
        avgFillPrice: 100 + Math.random() * 200,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      });
    }
    return orders;
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place equity order' })
  async placeOrder(@Body() params: {
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price?: number;
    orderType: 'market' | 'limit' | 'stop';
  }): Promise<EquityOrder> {
    return {
      id: `EQ-${Date.now()}`,
      symbol: params.symbol,
      side: params.side,
      quantity: params.quantity,
      price: params.price || 0,
      orderType: params.orderType,
      status: 'pending',
      filledQuantity: 0,
      avgFillPrice: 0,
      createdAt: new Date(),
    };
  }

  @Get('positions')
  @ApiOperation({ summary: 'Get equity positions' })
  async getPositions(): Promise<EquityPosition[]> {
    const positions: EquityPosition[] = [];
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];

    for (const symbol of symbols) {
      const qty = Math.floor(Math.random() * 500) + 50;
      const avgCost = 100 + Math.random() * 100;
      const currentPrice = avgCost * (0.9 + Math.random() * 0.2);
      const unrealizedPnL = qty * (currentPrice - avgCost);

      positions.push({
        symbol,
        quantity: qty,
        avgCost,
        currentPrice,
        unrealizedPnL,
        realizedPnL: Math.random() * 10000 - 5000,
        marketValue: qty * currentPrice,
      });
    }
    return positions;
  }

  @Get('market-data/:symbol')
  @ApiOperation({ summary: 'Get real-time market data' })
  async getMarketData(@Param('symbol') symbol: string): Promise<{
    symbol: string;
    price: number;
    bid: number;
    ask: number;
    volume: number;
    change: number;
    changePercent: number;
  }> {
    const price = 100 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;

    return {
      symbol,
      price,
      bid: price - 0.05,
      ask: price + 0.05,
      volume: Math.floor(Math.random() * 10000000),
      change,
      changePercent: (change / price) * 100,
    };
  }
}

export function EquityTradingDashboard() {
  const [orders, setOrders] = useState<EquityOrder[]>([]);
  const [positions, setPositions] = useState<EquityPosition[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/equity/orders').then(r => r.json()),
      fetch('/api/v1/equity/positions').then(r => r.json()),
    ]).then(([ord, pos]) => {
      setOrders(ord);
      setPositions(pos);
    });
  }, []);

  const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL + p.realizedPnL, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Equity Trading</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Portfolio Value</h3>
          <p className="text-2xl font-bold">${(totalValue / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Total P&L</h3>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(totalPnL / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600">Active Orders</h3>
          <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Positions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Symbol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.map((pos) => (
                  <tr key={pos.symbol}>
                    <td className="px-4 py-2 font-medium">{pos.symbol}</td>
                    <td className="px-4 py-2">{pos.quantity}</td>
                    <td className={`px-4 py-2 ${pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${pos.unrealizedPnL.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-2">
            {orders.slice(0, 8).map((order) => (
              <div key={order.id} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{order.symbol}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    order.status === 'filled' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{order.status}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {order.side.toUpperCase()} {order.quantity} @ ${order.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { EquityTradingController, EquityTradingDashboard };
