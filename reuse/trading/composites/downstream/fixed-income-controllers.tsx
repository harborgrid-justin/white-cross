/**
 * LOC: WC-DOWNSTREAM-FI-CTL-016
 * File: /reuse/trading/composites/downstream/fixed-income-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface BondOrder {
  id: string;
  cusip: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  yield: number;
  status: 'pending' | 'filled' | 'cancelled';
}

export interface BondPosition {
  cusip: string;
  issuer: string;
  maturity: Date;
  coupon: number;
  quantity: number;
  marketValue: number;
  accruedInterest: number;
}

@Controller('api/v1/fixed-income')
@ApiTags('Fixed Income')
@ApiBearerAuth()
@Injectable()
export class FixedIncomeController {
  private readonly logger = new Logger(FixedIncomeController.name);

  @Get('positions')
  @ApiOperation({ summary: 'Get bond positions' })
  async getPositions(): Promise<BondPosition[]> {
    return [
      {
        cusip: '912828ZG8',
        issuer: 'US Treasury',
        maturity: new Date('2030-05-15'),
        coupon: 2.875,
        quantity: 1000000,
        marketValue: 985000,
        accruedInterest: 1200,
      },
      {
        cusip: '023135BW5',
        issuer: 'Amazon.com',
        maturity: new Date('2027-12-05'),
        coupon: 3.150,
        quantity: 500000,
        marketValue: 492500,
        accruedInterest: 850,
      },
    ];
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place bond order' })
  async placeOrder(@Body() params: {
    cusip: string;
    side: 'buy' | 'sell';
    quantity: number;
    yield: number;
  }): Promise<BondOrder> {
    return {
      id: `BOND-${Date.now()}`,
      cusip: params.cusip,
      side: params.side,
      quantity: params.quantity,
      price: 98 + Math.random() * 4,
      yield: params.yield,
      status: 'pending',
    };
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get bond orders' })
  async getOrders(): Promise<BondOrder[]> {
    return [];
  }
}

export function FixedIncomeDashboard() {
  const [positions, setPositions] = useState<BondPosition[]>([]);

  useEffect(() => {
    fetch('/api/v1/fixed-income/positions')
      .then(r => r.json())
      .then(setPositions);
  }, []);

  const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fixed Income Portfolio</h1>
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-sm text-gray-600">Total Market Value</h3>
        <p className="text-2xl font-bold">${(totalValue / 1000000).toFixed(2)}M</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CUSIP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issuer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {positions.map((pos) => (
              <tr key={pos.cusip}>
                <td className="px-6 py-4 text-sm font-medium">{pos.cusip}</td>
                <td className="px-6 py-4 text-sm">{pos.issuer}</td>
                <td className="px-6 py-4 text-sm">{pos.coupon.toFixed(3)}%</td>
                <td className="px-6 py-4 text-sm">{new Date(pos.maturity).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">${pos.marketValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { FixedIncomeController, FixedIncomeDashboard };
