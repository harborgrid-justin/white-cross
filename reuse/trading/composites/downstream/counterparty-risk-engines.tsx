/**
 * LOC: WC-DOWNSTREAM-CPY-RISK-005
 * File: /reuse/trading/composites/downstream/counterparty-risk-engines.tsx
 *
 * UPSTREAM (imports from):
 *   - ../credit-risk-analysis-composite
 *   - @nestjs/common (v10.x)
 *   - react (v18.x)
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';
import {
  CreditAnalysisMethodology,
  ExposureType,
  CDSContractType,
  CreditAnalysis,
  CreditExposure,
} from '../credit-risk-analysis-composite';

export interface CounterpartyRiskProfile {
  counterpartyId: string;
  counterpartyName: string;
  creditRating: string;
  probabilityOfDefault: number;
  exposureAtDefault: number;
  lossGivenDefault: number;
  expectedLoss: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment: Date;
}

export interface ExposureAnalysis {
  id: string;
  counterpartyId: string;
  exposureType: ExposureType;
  currentExposure: number;
  potentialFutureExposure: number;
  collateralHeld: number;
  netExposure: number;
  utilizationRate: number;
  creditLimit: number;
}

@Controller('api/v1/risk/counterparty')
@ApiTags('Counterparty Risk')
@ApiBearerAuth()
@Injectable()
export class CounterpartyRiskEngineController {
  private readonly logger = new Logger(CounterpartyRiskEngineController.name);

  @Get('profiles')
  @ApiOperation({ summary: 'Get all counterparty risk profiles' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved' })
  async getCounterpartyProfiles(): Promise<CounterpartyRiskProfile[]> {
    this.logger.log('Fetching counterparty risk profiles');

    const profiles: CounterpartyRiskProfile[] = [];
    for (let i = 0; i < 20; i++) {
      const pd = Math.random() * 0.15;
      const ead = Math.random() * 50000000 + 10000000;
      const lgd = Math.random() * 0.6 + 0.2;
      const el = pd * ead * lgd;

      profiles.push({
        counterpartyId: `CP-${1000 + i}`,
        counterpartyName: `Counterparty ${String.fromCharCode(65 + i)}`,
        creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'][Math.floor(pd * 40)],
        probabilityOfDefault: pd,
        exposureAtDefault: ead,
        lossGivenDefault: lgd,
        expectedLoss: el,
        riskLevel: el > 5000000 ? 'critical' : el > 2000000 ? 'high' : el > 500000 ? 'medium' : 'low',
        lastAssessment: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    return profiles.sort((a, b) => b.expectedLoss - a.expectedLoss);
  }

  @Get('profiles/:counterpartyId')
  @ApiOperation({ summary: 'Get specific counterparty risk profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  async getCounterpartyProfile(@Param('counterpartyId') counterpartyId: string): Promise<CounterpartyRiskProfile> {
    this.logger.log(`Fetching profile for ${counterpartyId}`);

    const pd = Math.random() * 0.10;
    const ead = Math.random() * 30000000 + 5000000;
    const lgd = Math.random() * 0.5 + 0.3;

    return {
      counterpartyId,
      counterpartyName: `Counterparty ${counterpartyId}`,
      creditRating: 'A',
      probabilityOfDefault: pd,
      exposureAtDefault: ead,
      lossGivenDefault: lgd,
      expectedLoss: pd * ead * lgd,
      riskLevel: 'medium',
      lastAssessment: new Date(),
    };
  }

  @Get('exposures/:counterpartyId')
  @ApiOperation({ summary: 'Get exposure analysis for counterparty' })
  @ApiResponse({ status: 200, description: 'Exposures retrieved' })
  async getExposureAnalysis(@Param('counterpartyId') counterpartyId: string): Promise<ExposureAnalysis[]> {
    this.logger.log(`Fetching exposures for ${counterpartyId}`);

    const exposures: ExposureAnalysis[] = [];
    const exposureTypes = Object.values(ExposureType);

    for (let i = 0; i < 3; i++) {
      const currentExp = Math.random() * 20000000;
      const pfe = currentExp * (1 + Math.random() * 0.5);
      const collateral = currentExp * Math.random() * 0.8;
      const limit = currentExp * (1.5 + Math.random() * 0.5);

      exposures.push({
        id: `EXP-${Date.now()}-${i}`,
        counterpartyId,
        exposureType: exposureTypes[i % exposureTypes.length],
        currentExposure: currentExp,
        potentialFutureExposure: pfe,
        collateralHeld: collateral,
        netExposure: currentExp - collateral,
        utilizationRate: (currentExp / limit) * 100,
        creditLimit: limit,
      });
    }

    return exposures;
  }

  @Post('assess')
  @ApiOperation({ summary: 'Run counterparty risk assessment' })
  @ApiResponse({ status: 200, description: 'Assessment completed' })
  @HttpCode(HttpStatus.OK)
  async assessCounterpartyRisk(
    @Body() params: {
      counterpartyId: string;
      methodology: CreditAnalysisMethodology;
      includeCVA: boolean;
    }
  ): Promise<{
    assessment: CounterpartyRiskProfile;
    cvaAdjustment?: number;
    recommendations: string[];
  }> {
    this.logger.log(`Assessing risk for ${params.counterpartyId}`);

    const profile = await this.getCounterpartyProfile(params.counterpartyId);
    const cvaAdjustment = params.includeCVA ? profile.expectedLoss * 0.15 : undefined;

    const recommendations: string[] = [];
    if (profile.riskLevel === 'critical') {
      recommendations.push('Reduce exposure immediately');
      recommendations.push('Increase collateral requirements');
      recommendations.push('Consider hedging strategies');
    } else if (profile.riskLevel === 'high') {
      recommendations.push('Monitor exposure closely');
      recommendations.push('Review credit limits');
    }

    return {
      assessment: profile,
      cvaAdjustment,
      recommendations,
    };
  }

  @Get('limits/utilization')
  @ApiOperation({ summary: 'Get credit limit utilization summary' })
  @ApiResponse({ status: 200, description: 'Utilization summary retrieved' })
  async getLimitUtilization(): Promise<{
    totalLimit: number;
    totalExposure: number;
    utilizationRate: number;
    counterparties: Array<{
      counterpartyId: string;
      utilizationRate: number;
      status: 'normal' | 'warning' | 'breach';
    }>;
  }> {
    this.logger.log('Calculating limit utilization');

    const profiles = await this.getCounterpartyProfiles();
    const totalExposure = profiles.reduce((sum, p) => sum + p.exposureAtDefault, 0);
    const totalLimit = totalExposure * 1.5;

    const counterparties = profiles.slice(0, 10).map((p) => {
      const utilization = (p.exposureAtDefault / (p.exposureAtDefault * 1.5)) * 100;
      return {
        counterpartyId: p.counterpartyId,
        utilizationRate: utilization,
        status: utilization > 95 ? 'breach' as const : utilization > 80 ? 'warning' as const : 'normal' as const,
      };
    });

    return {
      totalLimit,
      totalExposure,
      utilizationRate: (totalExposure / totalLimit) * 100,
      counterparties,
    };
  }
}

export function CounterpartyRiskDashboard() {
  const [profiles, setProfiles] = useState<CounterpartyRiskProfile[]>([]);
  const [utilization, setUtilization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, utilizationRes] = await Promise.all([
          fetch('/api/v1/risk/counterparty/profiles'),
          fetch('/api/v1/risk/counterparty/limits/utilization'),
        ]);

        setProfiles(await profilesRes.json());
        setUtilization(await utilizationRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Counterparty Risk Engine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Exposure</h3>
          <p className="text-2xl font-bold">${(utilization?.totalExposure / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Utilization Rate</h3>
          <p className="text-2xl font-bold">{utilization?.utilizationRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">High Risk Counterparties</h3>
          <p className="text-2xl font-bold">{profiles.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top Risk Counterparties</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counterparty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exposure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Loss</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.slice(0, 15).map((profile) => (
                <tr key={profile.counterpartyId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{profile.counterpartyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{profile.creditRating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{(profile.probabilityOfDefault * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${(profile.exposureAtDefault / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${(profile.expectedLoss / 1000000).toFixed(2)}M</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      profile.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                      profile.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      profile.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {profile.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { CounterpartyRiskEngineController, CounterpartyRiskDashboard };
export type { CounterpartyRiskProfile, ExposureAnalysis };
