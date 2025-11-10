/**
 * LOC: WC-DOWNSTREAM-MARGIN-CTL-020
 * File: /reuse/trading/composites/downstream/margin-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface MarginAccount {
  accountId: string;
  accountName: string;
  equity: number;
  marginUsed: number;
  marginAvailable: number;
  maintenanceMargin: number;
  marginLevel: number;
  status: 'healthy' | 'warning' | 'margin_call' | 'liquidation';
}

export interface MarginRequirement {
  securityId: string;
  symbol: string;
  initialMargin: number;
  maintenanceMargin: number;
  marginRate: number;
  haircut: number;
}

export interface MarginCall {
  id: string;
  accountId: string;
  callAmount: number;
  dueDate: Date;
  status: 'pending' | 'met' | 'overdue';
  positions: string[];
}

@Controller('api/v1/margin')
@ApiTags('Margin Management')
@ApiBearerAuth()
@Injectable()
export class MarginController {
  private readonly logger = new Logger(MarginController.name);

  @Get('accounts')
  @ApiOperation({ summary: 'Get margin accounts' })
  async getAccounts(): Promise<MarginAccount[]> {
    const accounts: MarginAccount[] = [];

    for (let i = 0; i < 10; i++) {
      const equity = 500000 + Math.random() * 1000000;
      const marginUsed = equity * (0.3 + Math.random() * 0.5);
      const maintenanceMargin = marginUsed * 0.25;
      const marginAvailable = equity - marginUsed;
      const marginLevel = (equity / marginUsed) * 100;

      let status: MarginAccount['status'];
      if (marginLevel > 150) status = 'healthy';
      else if (marginLevel > 120) status = 'warning';
      else if (marginLevel > 100) status = 'margin_call';
      else status = 'liquidation';

      accounts.push({
        accountId: `ACC-${1000 + i}`,
        accountName: `Account ${i + 1}`,
        equity,
        marginUsed,
        marginAvailable,
        maintenanceMargin,
        marginLevel,
        status,
      });
    }

    return accounts;
  }

  @Get('accounts/:accountId')
  @ApiOperation({ summary: 'Get margin account details' })
  async getAccount(@Param('accountId') accountId: string): Promise<MarginAccount> {
    const equity = 750000;
    const marginUsed = 450000;
    const maintenanceMargin = 112500;
    const marginAvailable = equity - marginUsed;
    const marginLevel = (equity / marginUsed) * 100;

    return {
      accountId,
      accountName: 'Trading Account',
      equity,
      marginUsed,
      marginAvailable,
      maintenanceMargin,
      marginLevel,
      status: marginLevel > 150 ? 'healthy' : 'warning',
    };
  }

  @Get('requirements/:symbol')
  @ApiOperation({ summary: 'Get margin requirements for security' })
  async getRequirements(@Param('symbol') symbol: string): Promise<MarginRequirement> {
    return {
      securityId: `SEC-${symbol}`,
      symbol,
      initialMargin: 0.50,
      maintenanceMargin: 0.25,
      marginRate: 0.50,
      haircut: 0.15,
    };
  }

  @Get('calls')
  @ApiOperation({ summary: 'Get margin calls' })
  async getMarginCalls(@Query('status') status?: string): Promise<MarginCall[]> {
    const calls: MarginCall[] = [];

    for (let i = 0; i < 5; i++) {
      calls.push({
        id: `CALL-${Date.now()}-${i}`,
        accountId: `ACC-${1000 + i}`,
        callAmount: 50000 + Math.random() * 100000,
        dueDate: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000),
        status: status as any || ['pending', 'met', 'overdue'][Math.floor(Math.random() * 3)] as any,
        positions: ['POS-1', 'POS-2', 'POS-3'],
      });
    }

    return status ? calls.filter(c => c.status === status) : calls;
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate margin requirement' })
  async calculateMargin(@Body() params: {
    positions: Array<{ symbol: string; quantity: number; price: number }>;
  }): Promise<{
    totalValue: number;
    initialMargin: number;
    maintenanceMargin: number;
    marginRequired: number;
  }> {
    const totalValue = params.positions.reduce((sum, p) => sum + p.quantity * p.price, 0);
    const initialMargin = totalValue * 0.50;
    const maintenanceMargin = totalValue * 0.25;
    const marginRequired = initialMargin;

    return {
      totalValue,
      initialMargin,
      maintenanceMargin,
      marginRequired,
    };
  }

  @Post('accounts/:accountId/deposit')
  @ApiOperation({ summary: 'Deposit funds to margin account' })
  async depositFunds(
    @Param('accountId') accountId: string,
    @Body() params: { amount: number }
  ): Promise<{ success: boolean; newEquity: number }> {
    this.logger.log(`Deposited $${params.amount} to account ${accountId}`);
    return {
      success: true,
      newEquity: 750000 + params.amount,
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get margin metrics summary' })
  async getMetrics(): Promise<{
    totalAccounts: number;
    healthyAccounts: number;
    warningAccounts: number;
    marginCallAccounts: number;
    totalMarginUsed: number;
    totalMarginAvailable: number;
    avgMarginLevel: number;
  }> {
    return {
      totalAccounts: 250,
      healthyAccounts: 200,
      warningAccounts: 35,
      marginCallAccounts: 15,
      totalMarginUsed: 125000000,
      totalMarginAvailable: 85000000,
      avgMarginLevel: 168.5,
    };
  }
}

export function MarginDashboard() {
  const [accounts, setAccounts] = useState<MarginAccount[]>([]);
  const [calls, setCalls] = useState<MarginCall[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/margin/accounts').then(r => r.json()),
      fetch('/api/v1/margin/calls?status=pending').then(r => r.json()),
      fetch('/api/v1/margin/metrics').then(r => r.json()),
    ]).then(([a, c, m]) => {
      setAccounts(a);
      setCalls(c);
      setMetrics(m);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Margin Management</h1>

      {metrics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Total Accounts</h3>
            <p className="text-2xl font-bold">{metrics.totalAccounts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Margin Calls</h3>
            <p className="text-2xl font-bold text-red-600">{metrics.marginCallAccounts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Margin Used</h3>
            <p className="text-2xl font-bold">${(metrics.totalMarginUsed / 1000000).toFixed(0)}M</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600">Avg Margin Level</h3>
            <p className="text-2xl font-bold">{metrics.avgMarginLevel.toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Margin Accounts</h2>
          <div className="space-y-3">
            {accounts.slice(0, 8).map((account) => (
              <div
                key={account.accountId}
                className={`p-4 rounded border-l-4 ${
                  account.status === 'healthy' ? 'border-green-500 bg-green-50' :
                  account.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  account.status === 'margin_call' ? 'border-red-500 bg-red-50' :
                  'border-gray-500 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{account.accountName}</span>
                  <span className="text-sm font-semibold">{account.marginLevel.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Equity: ${(account.equity / 1000).toFixed(0)}K</div>
                  <div>Used: ${(account.marginUsed / 1000).toFixed(0)}K</div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        account.status === 'healthy' ? 'bg-green-500' :
                        account.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (account.marginUsed / account.equity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Margin Calls</h2>
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{call.accountId}</span>
                  <span className="text-red-600 font-bold">${(call.callAmount / 1000).toFixed(0)}K</span>
                </div>
                <div className="text-sm text-gray-600">
                  Due: {new Date(call.dueDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Positions: {call.positions.join(', ')}
                </div>
              </div>
            ))}
            {calls.length === 0 && (
              <div className="text-center text-gray-500 py-8">No pending margin calls</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MarginController, MarginDashboard };
export type { MarginAccount, MarginRequirement, MarginCall };
