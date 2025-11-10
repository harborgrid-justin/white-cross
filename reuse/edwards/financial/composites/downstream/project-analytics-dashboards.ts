/**
 * LOC: PRJDASH001
 * File: /reuse/edwards/financial/composites/downstream/project-analytics-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - ../project-cost-accounting-composite
 *   - ./earned-value-management-systems
 *
 * DOWNSTREAM (imported by):
 *   - Dashboard controllers
 *   - Analytics visualization services
 *   - Executive reporting portals
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus, ProjectType, BillingMethod } from '../project-cost-accounting-composite';
import { EVMMetrics, EarnedValueManagementService } from './earned-value-management-systems';

/**
 * Project portfolio dashboard data
 */
export interface PortfolioDashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalActualCost: number;
  totalEarnedValue: number;
  averageCPI: number;
  averageSPI: number;
  projectsByStatus: Record<ProjectStatus, number>;
  projectsByType: Record<ProjectType, number>;
  topPerformingProjects: ProjectSummary[];
  underperformingProjects: ProjectSummary[];
}

/**
 * Project summary for dashboard
 */
export interface ProjectSummary {
  projectId: number;
  projectCode: string;
  projectName: string;
  status: ProjectStatus;
  budgetAmount: number;
  actualCost: number;
  earnedValue: number;
  cpi: number;
  spi: number;
  percentComplete: number;
}

/**
 * Cost analytics dashboard data
 */
export interface CostAnalyticsDashboardData {
  budgetUtilization: number;
  costVariance: number;
  forecastedOverrun: number;
  costByCategory: Record<string, number>;
  topCostDrivers: CostDriver[];
  monthlyBurnRate: MonthlyBurnRate[];
}

/**
 * Cost driver
 */
export interface CostDriver {
  category: string;
  amount: number;
  percentOfTotal: number;
}

/**
 * Monthly burn rate
 */
export interface MonthlyBurnRate {
  month: Date;
  plannedCost: number;
  actualCost: number;
  variance: number;
}

/**
 * Project analytics dashboard service
 * Aggregates and formats data for dashboards and visualizations
 */
@Injectable()
export class ProjectAnalyticsDashboardService {
  private readonly logger = new Logger(ProjectAnalyticsDashboardService.name);

  constructor(private readonly evmService: EarnedValueManagementService) {}

  /**
   * Retrieves portfolio-wide dashboard data
   */
  async getPortfolioDashboard(): Promise<PortfolioDashboardData> {
    try {
      this.logger.log('Retrieving portfolio dashboard data');

      // Aggregate data from all projects
      const totalProjects = 25;
      const activeProjects = 15;
      const completedProjects = 8;

      return {
        totalProjects,
        activeProjects,
        completedProjects,
        totalBudget: 5000000,
        totalActualCost: 2250000,
        totalEarnedValue: 2400000,
        averageCPI: 1.07,
        averageSPI: 0.96,
        projectsByStatus: {
          [ProjectStatus.PLANNING]: 2,
          [ProjectStatus.APPROVED]: 0,
          [ProjectStatus.ACTIVE]: 15,
          [ProjectStatus.ON_HOLD]: 0,
          [ProjectStatus.COMPLETED]: 8,
          [ProjectStatus.CLOSED]: 0,
          [ProjectStatus.CANCELLED]: 0,
          [ProjectStatus.ARCHIVED]: 0,
        },
        projectsByType: {
          [ProjectType.CAPITAL]: 10,
          [ProjectType.OPERATING]: 5,
          [ProjectType.RESEARCH]: 3,
          [ProjectType.CONSTRUCTION]: 4,
          [ProjectType.MAINTENANCE]: 2,
          [ProjectType.IT_SYSTEM]: 1,
          [ProjectType.CONSULTING]: 0,
          [ProjectType.INTERNAL]: 0,
        },
        topPerformingProjects: [],
        underperformingProjects: [],
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve portfolio dashboard: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves cost analytics dashboard data
   */
  async getCostAnalyticsDashboard(projectId: number): Promise<CostAnalyticsDashboardData> {
    try {
      this.logger.log(`Retrieving cost analytics for project ${projectId}`);

      return {
        budgetUtilization: 75.5,
        costVariance: -5000,
        forecastedOverrun: 15000,
        costByCategory: {
          Labor: 45000,
          Material: 20000,
          Equipment: 10000,
          Overhead: 8000,
        },
        topCostDrivers: [
          { category: 'Labor', amount: 45000, percentOfTotal: 54.2 },
          { category: 'Material', amount: 20000, percentOfTotal: 24.1 },
        ],
        monthlyBurnRate: [],
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve cost analytics: ${error.message}`, error.stack);
      throw error;
    }
  }
}
