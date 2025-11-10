/**
 * LOC: WC-DOWNSTREAM-CREDIT-CTL-006
 * File: /reuse/trading/composites/downstream/credit-risk-controllers.tsx
 */

'use client';

import { Injectable, Controller, Get, Post, Put, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';

export interface CreditRiskAssessment {
  id: string;
  entityId: string;
  entityName: string;
  creditScore: number;
  creditRating: string;
  defaultProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessmentDate: Date;
  nextReviewDate: Date;
}

@Controller('api/v1/credit/risk')
@ApiTags('Credit Risk')
@ApiBearerAuth()
@Injectable()
export class CreditRiskController {
  private readonly logger = new Logger(CreditRiskController.name);

  @Get('assessments')
  @ApiOperation({ summary: 'Get all credit risk assessments' })
  @ApiResponse({ status: 200, description: 'Assessments retrieved' })
  async getAssessments(): Promise<CreditRiskAssessment[]> {
    const assessments: CreditRiskAssessment[] = [];
    for (let i = 0; i < 15; i++) {
      assessments.push({
        id: `ASSESS-${i}`,
        entityId: `ENT-${1000 + i}`,
        entityName: `Entity ${i}`,
        creditScore: 300 + Math.random() * 550,
        creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB'][Math.floor(Math.random() * 5)],
        defaultProbability: Math.random() * 0.1,
        riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        assessmentDate: new Date(),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    }
    return assessments;
  }

  @Post('assess')
  @ApiOperation({ summary: 'Run new credit assessment' })
  @HttpCode(HttpStatus.CREATED)
  async createAssessment(@Body() params: { entityId: string }): Promise<CreditRiskAssessment> {
    return {
      id: `ASSESS-${Date.now()}`,
      entityId: params.entityId,
      entityName: `Entity ${params.entityId}`,
      creditScore: 700,
      creditRating: 'A',
      defaultProbability: 0.02,
      riskLevel: 'low',
      assessmentDate: new Date(),
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };
  }
}

export function CreditRiskDashboard() {
  const [assessments, setAssessments] = useState<CreditRiskAssessment[]>([]);

  useEffect(() => {
    fetch('/api/v1/credit/risk/assessments')
      .then((r) => r.json())
      .then(setAssessments);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Credit Risk Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assessments.map((a) => (
              <tr key={a.id}>
                <td className="px-6 py-4">{a.entityName}</td>
                <td className="px-6 py-4">{a.creditScore.toFixed(0)}</td>
                <td className="px-6 py-4">{a.creditRating}</td>
                <td className="px-6 py-4">{(a.defaultProbability * 100).toFixed(2)}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    a.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    a.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    a.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>{a.riskLevel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { CreditRiskController, CreditRiskDashboard };
