/**
 * LOC: WC-DOWNSTREAM-COMPLY-SVC-004
 * File: /reuse/trading/composites/downstream/compliance-services.tsx
 *
 * UPSTREAM (imports from):
 *   - ../market-surveillance-compliance-composite
 *   - @nestjs/common (v10.x)
 *   - react (v18.x)
 */

'use client';

import { Injectable, Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { useState, useEffect } from 'react';
import {
  MarketSurveillanceComposite,
  SurveillanceAlert,
  CaseWorkflow,
  AlertSeverityLevel,
  AlertStatus,
  ManipulationType,
} from '../market-surveillance-compliance-composite';

export interface ComplianceCase {
  id: string;
  caseType: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'closed';
  createdAt: Date;
  assignedTo?: string;
  alerts: number;
  estimatedImpact: number;
}

export interface ComplianceWorkflow {
  id: string;
  workflowType: 'investigation' | 'remediation' | 'reporting';
  currentStep: string;
  progress: number;
  assignedTeam: string;
  deadline: Date;
}

@Controller('api/v1/compliance/services')
@ApiTags('Compliance Services')
@ApiBearerAuth()
@Injectable()
export class ComplianceServicesController {
  private readonly logger = new Logger(ComplianceServicesController.name);

  constructor(private readonly surveillanceService: MarketSurveillanceComposite) {}

  @Get('cases')
  @ApiOperation({ summary: 'Get all compliance cases' })
  @ApiResponse({ status: 200, description: 'Cases retrieved' })
  async getCases(): Promise<ComplianceCase[]> {
    this.logger.log('Fetching compliance cases');

    const cases: ComplianceCase[] = [];
    for (let i = 0; i < 15; i++) {
      cases.push({
        id: `CASE-${Date.now()}-${i}`,
        caseType: ['Market Manipulation', 'Insider Trading', 'Best Execution'][i % 3],
        priority: ['critical', 'high', 'medium', 'low'][i % 4] as any,
        status: ['open', 'investigating', 'closed'][i % 3] as any,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        assignedTo: `Analyst-${i % 5}`,
        alerts: Math.floor(Math.random() * 10) + 1,
        estimatedImpact: Math.random() * 1000000,
      });
    }

    return cases;
  }

  @Post('cases/:caseId/workflow')
  @ApiOperation({ summary: 'Create workflow for compliance case' })
  @ApiResponse({ status: 201, description: 'Workflow created' })
  @HttpCode(HttpStatus.CREATED)
  async createWorkflow(
    @Param('caseId') caseId: string,
    @Body() params: { workflowType: string; assignedTeam: string }
  ): Promise<ComplianceWorkflow> {
    this.logger.log(`Creating workflow for case ${caseId}`);

    return {
      id: `WF-${Date.now()}`,
      workflowType: params.workflowType as any,
      currentStep: 'Initial Review',
      progress: 0,
      assignedTeam: params.assignedTeam,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  @Get('workflows')
  @ApiOperation({ summary: 'Get active workflows' })
  @ApiResponse({ status: 200, description: 'Workflows retrieved' })
  async getWorkflows(): Promise<ComplianceWorkflow[]> {
    this.logger.log('Fetching compliance workflows');

    const workflows: ComplianceWorkflow[] = [];
    for (let i = 0; i < 8; i++) {
      workflows.push({
        id: `WF-${Date.now()}-${i}`,
        workflowType: ['investigation', 'remediation', 'reporting'][i % 3] as any,
        currentStep: ['Review', 'Analysis', 'Reporting'][i % 3],
        progress: Math.floor(Math.random() * 100),
        assignedTeam: `Team-${i % 3}`,
        deadline: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
      });
    }

    return workflows;
  }
}

export function ComplianceServicesDashboard() {
  const [cases, setCases] = useState<ComplianceCase[]>([]);
  const [workflows, setWorkflows] = useState<ComplianceWorkflow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [casesRes, workflowsRes] = await Promise.all([
        fetch('/api/v1/compliance/services/cases'),
        fetch('/api/v1/compliance/services/workflows'),
      ]);

      setCases(await casesRes.json());
      setWorkflows(await workflowsRes.json());
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Services</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Cases</h2>
          <div className="space-y-3">
            {cases.filter(c => c.status !== 'closed').map((case_) => (
              <div key={case_.id} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{case_.caseType}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    case_.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    case_.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {case_.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {case_.alerts} alert{case_.alerts !== 1 ? 's' : ''} • Assigned to {case_.assignedTo}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{workflow.workflowType.toUpperCase()}</span>
                  <span className="text-sm text-gray-600">{workflow.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${workflow.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {workflow.currentStep} • {workflow.assignedTeam}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ComplianceServicesController, ComplianceServicesDashboard };
export type { ComplianceCase, ComplianceWorkflow };
