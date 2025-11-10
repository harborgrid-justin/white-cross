/**
 * LOC: WC-DOWNSTREAM-DVP-SETTLE-008
 * File: /reuse/trading/composites/downstream/dvp-settlement-services.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Put, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/common';
import { useState, useEffect } from 'react';
import {
  SettlementCycle,
  SettlementStatus,
  SettlementType,
  ClearingHouse,
  SettlementRecord,
} from '../trade-settlement-clearing-composite';

export interface DVPInstruction {
  id: string;
  tradeId: string;
  securityIsin: string;
  quantity: number;
  price: number;
  settlementDate: Date;
  deliverFrom: string;
  deliverTo: string;
  status: 'pending' | 'matched' | 'settling' | 'settled' | 'failed';
  matchedAt?: Date;
  settledAt?: Date;
}

@Controller('api/v1/settlement/dvp')
@ApiTags('DVP Settlement')
@ApiBearerAuth()
@Injectable()
export class DVPSettlementController {
  private readonly logger = new Logger(DVPSettlementController.name);

  @Get('instructions')
  @ApiOperation({ summary: 'Get DVP settlement instructions' })
  async getInstructions(): Promise<DVPInstruction[]> {
    const instructions: DVPInstruction[] = [];
    for (let i = 0; i < 20; i++) {
      instructions.push({
        id: `DVP-${Date.now()}-${i}`,
        tradeId: `TRD-${1000 + i}`,
        securityIsin: `US${Math.floor(Math.random() * 10000000000)}`,
        quantity: Math.floor(Math.random() * 10000) + 100,
        price: 100 + Math.random() * 50,
        settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deliverFrom: `PARTY-${Math.floor(Math.random() * 100)}`,
        deliverTo: `PARTY-${Math.floor(Math.random() * 100)}`,
        status: ['pending', 'matched', 'settling', 'settled'][Math.floor(Math.random() * 4)] as any,
        matchedAt: Math.random() > 0.5 ? new Date() : undefined,
        settledAt: Math.random() > 0.8 ? new Date() : undefined,
      });
    }
    return instructions;
  }

  @Post('instructions')
  @ApiOperation({ summary: 'Create DVP instruction' })
  async createInstruction(@Body() params: {
    tradeId: string;
    securityIsin: string;
    quantity: number;
    price: number;
  }): Promise<DVPInstruction> {
    return {
      id: `DVP-${Date.now()}`,
      tradeId: params.tradeId,
      securityIsin: params.securityIsin,
      quantity: params.quantity,
      price: params.price,
      settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      deliverFrom: 'PARTY-A',
      deliverTo: 'PARTY-B',
      status: 'pending',
    };
  }

  @Put('instructions/:id/match')
  @ApiOperation({ summary: 'Match DVP instruction' })
  async matchInstruction(@Param('id') id: string): Promise<DVPInstruction> {
    return {
      id,
      tradeId: `TRD-${Date.now()}`,
      securityIsin: 'US0378331005',
      quantity: 1000,
      price: 150.25,
      settlementDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      deliverFrom: 'PARTY-A',
      deliverTo: 'PARTY-B',
      status: 'matched',
      matchedAt: new Date(),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get DVP settlement metrics' })
  async getMetrics(): Promise<{
    totalInstructions: number;
    pending: number;
    matched: number;
    settled: number;
    failed: number;
    settlementRate: number;
  }> {
    const total = 245;
    const pending = 18;
    const matched = 42;
    const settled = 180;
    const failed = 5;

    return {
      totalInstructions: total,
      pending,
      matched,
      settled,
      failed,
      settlementRate: (settled / total) * 100,
    };
  }
}

export function DVPSettlementDashboard() {
  const [instructions, setInstructions] = useState<DVPInstruction[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/settlement/dvp/instructions').then(r => r.json()),
      fetch('/api/v1/settlement/dvp/metrics').then(r => r.json()),
    ]).then(([inst, met]) => {
      setInstructions(inst);
      setMetrics(met);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">DVP Settlement Services</h1>
      {metrics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Total</h3>
            <p className="text-2xl font-bold">{metrics.totalInstructions}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Settled</h3>
            <p className="text-2xl font-bold text-green-600">{metrics.settled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{metrics.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Settlement Rate</h3>
            <p className="text-2xl font-bold">{metrics.settlementRate.toFixed(1)}%</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISIN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {instructions.slice(0, 10).map((inst) => (
              <tr key={inst.id}>
                <td className="px-6 py-4 text-sm">{inst.id}</td>
                <td className="px-6 py-4 text-sm">{inst.securityIsin}</td>
                <td className="px-6 py-4 text-sm">{inst.quantity.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">${inst.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    inst.status === 'settled' ? 'bg-green-100 text-green-800' :
                    inst.status === 'failed' ? 'bg-red-100 text-red-800' :
                    inst.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{inst.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DVPSettlementController, DVPSettlementDashboard };
