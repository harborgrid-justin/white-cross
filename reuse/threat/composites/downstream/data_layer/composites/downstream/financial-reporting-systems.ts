/**
 * LOC: FINREPORT001
 * File: financial-reporting-systems.ts
 * Purpose: Financial metrics, cost analysis, and ROI reporting for threat intelligence operations
 */

import { Injectable, Logger } from "@nestjs/common";
import { MetricsCalculationService } from "../metrics-calculation-kit";
import { AggregationAnalyticsService } from "../aggregation-analytics-kit";

export interface IFinancialMetrics {
  totalCost: number;
  costByCategory: Record<string, number>;
  roi: number;
  costSavings: number;
  budgetUtilization: number;
  period: { start: Date; end: Date };
}

export enum CostCategory {
  INFRASTRUCTURE = "INFRASTRUCTURE",
  SECURITY_TOOLS = "SECURITY_TOOLS",
  PERSONNEL = "PERSONNEL",
  INCIDENT_RESPONSE = "INCIDENT_RESPONSE",
  TRAINING = "TRAINING",
  COMPLIANCE = "COMPLIANCE",
  THREAT_INTELLIGENCE = "THREAT_INTELLIGENCE",
}

@Injectable()
export class FinancialReportingService {
  private readonly logger = new Logger(FinancialReportingService.name);
  private readonly costs: Array<{ category: CostCategory; amount: number; date: Date }> = [];

  constructor(
    private readonly metricsService: MetricsCalculationService,
    private readonly aggregationService: AggregationAnalyticsService,
  ) {}

  async generateFinancialReport(startDate: Date, endDate: Date): Promise<IFinancialMetrics> {
    this.logger.log(`Generating financial report for ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const periodCosts = this.costs.filter(c => c.date >= startDate && c.date <= endDate);

    const totalCost = periodCosts.reduce((sum, c) => sum + c.amount, 0);
    
    const costByCategory: Record<string, number> = {};
    for (const category of Object.values(CostCategory)) {
      const categoryCosts = periodCosts.filter(c => c.category === category);
      costByCategory[category] = categoryCosts.reduce((sum, c) => sum + c.amount, 0);
    }

    // Calculate ROI (threats prevented * avg incident cost - total security spend)
    const threatsPrevented = await this.calculateThreatsPrevented(startDate, endDate);
    const avgIncidentCost = 500000; // Average cost per security incident
    const costSavings = threatsPrevented * avgIncidentCost;
    const roi = ((costSavings - totalCost) / totalCost) * 100;

    const budget = 5000000; // Annual security budget
    const budgetUtilization = (totalCost / budget) * 100;

    return {
      totalCost,
      costByCategory,
      roi,
      costSavings,
      budgetUtilization,
      period: { start: startDate, end: endDate },
    };
  }

  async calculateTCO(years: number = 3): Promise<{
    totalCostOfOwnership: number;
    yearlyBreakdown: Array<{ year: number; cost: number }>;
    costPerUser: number;
    costPerAsset: number;
  }> {
    const yearlyBreakdown: Array<{ year: number; cost: number }> = [];
    let totalCostOfOwnership = 0;

    for (let year = 1; year <= years; year++) {
      const yearCost = this.calculateYearlyCost(year);
      yearlyBreakdown.push({ year, cost: yearCost });
      totalCostOfOwnership += yearCost;
    }

    const users = 1000;
    const assets = 5000;

    return {
      totalCostOfOwnership,
      yearlyBreakdown,
      costPerUser: totalCostOfOwnership / users / years,
      costPerAsset: totalCostOfOwnership / assets / years,
    };
  }

  async analyzeSecuritySpending(): Promise<{
    totalSpent: number;
    avgMonthlySpend: number;
    spendingTrend: "increasing" | "decreasing" | "stable";
    topCategories: Array<{ category: string; amount: number; percentage: number }>;
  }> {
    const totalSpent = this.costs.reduce((sum, c) => sum + c.amount, 0);
    const months = 12;
    const avgMonthlySpend = totalSpent / months;

    // Calculate spending trend
    const recentMonths = this.costs.filter(c => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return c.date >= threeMonthsAgo;
    });

    const oldMonths = this.costs.filter(c => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return c.date >= sixMonthsAgo && c.date < threeMonthsAgo;
    });

    const recentAvg = recentMonths.reduce((sum, c) => sum + c.amount, 0) / 3;
    const oldAvg = oldMonths.reduce((sum, c) => sum + c.amount, 0) / 3;

    let spendingTrend: "increasing" | "decreasing" | "stable" = "stable";
    if (recentAvg > oldAvg * 1.1) spendingTrend = "increasing";
    else if (recentAvg < oldAvg * 0.9) spendingTrend = "decreasing";

    // Top spending categories
    const categoryTotals: Record<string, number> = {};
    for (const cost of this.costs) {
      categoryTotals[cost.category] = (categoryTotals[cost.category] || 0) + cost.amount;
    }

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { totalSpent, avgMonthlySpend, spendingTrend, topCategories };
  }

  async projectFutureCosts(months: number = 12): Promise<{
    projectedTotal: number;
    monthlyProjections: Array<{ month: string; amount: number }>;
    assumptions: string[];
  }> {
    const avgMonthlySpend = this.costs.reduce((sum, c) => sum + c.amount, 0) / 12;
    const growthRate = 1.05; // 5% annual growth

    const monthlyProjections: Array<{ month: string; amount: number }> = [];
    let projectedTotal = 0;

    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthStr = date.toISOString().substring(0, 7);
      
      const projectedAmount = avgMonthlySpend * Math.pow(growthRate, i / 12);
      monthlyProjections.push({ month: monthStr, amount: projectedAmount });
      projectedTotal += projectedAmount;
    }

    const assumptions = [
      "5% annual cost growth rate",
      "Current threat landscape maintained",
      "No major security incidents",
      "Existing tool licenses renewed",
    ];

    return { projectedTotal, monthlyProjections, assumptions };
  }

  recordCost(category: CostCategory, amount: number, date: Date = new Date()): void {
    this.costs.push({ category, amount, date });
    this.logger.log(`Recorded cost: ${category} - $${amount}`);
  }

  private async calculateThreatsPrevented(startDate: Date, endDate: Date): Promise<number> {
    // Mock calculation - would query actual threat data
    return 25;
  }

  private calculateYearlyCost(year: number): number {
    const baseCost = 3000000;
    const growthRate = 1.08; // 8% annual increase
    return baseCost * Math.pow(growthRate, year - 1);
  }
}

export { FinancialReportingService };
