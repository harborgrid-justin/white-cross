/**
 * LOC: RISKMGMT001
 * File: risk-management-systems.ts
 * Purpose: Enterprise risk assessment, scoring, and mitigation tracking
 * Competes with: Recorded Future Risk Intelligence, Anomali ThreatStream
 */

import { Injectable, Logger } from "@nestjs/common";
import { AggregationAnalyticsService } from "../aggregation-analytics-kit";
import { ComplexQueriesService } from "../complex-queries-kit";

export enum RiskLevel {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  MINIMAL = "MINIMAL",
}

export enum RiskCategory {
  CYBER_THREAT = "CYBER_THREAT",
  OPERATIONAL = "OPERATIONAL",
  COMPLIANCE = "COMPLIANCE",
  FINANCIAL = "FINANCIAL",
  REPUTATIONAL = "REPUTATIONAL",
  STRATEGIC = "STRATEGIC",
}

export interface IRiskAssessment {
  id: string;
  name: string;
  category: RiskCategory;
  level: RiskLevel;
  score: number; // 0-100
  probability: number; // 0-1
  impact: number; // 0-10
  mitigationStatus: "not_started" | "in_progress" | "completed";
  threats: string[];
  assets: string[];
  controls: IControl[];
  residualRisk: number;
  treatmentPlan?: string;
  owner?: string;
  assessedAt: Date;
  nextReviewDate: Date;
}

export interface IControl {
  id: string;
  name: string;
  type: "preventive" | "detective" | "corrective";
  effectiveness: number; // 0-1
  implemented: boolean;
  cost: number;
}

export interface IRiskMatrix {
  probability: number;
  impact: number;
  riskScore: number;
  level: RiskLevel;
}

@Injectable()
export class RiskManagementSystemsService {
  private readonly logger = new Logger(RiskManagementSystemsService.name);
  private readonly riskAssessments: Map<string, IRiskAssessment> = new Map();

  constructor(
    private readonly aggregationService: AggregationAnalyticsService,
    private readonly complexQueryService: ComplexQueriesService,
  ) {}

  async assessRisk(data: Partial<IRiskAssessment>): Promise<IRiskAssessment> {
    const score = this.calculateRiskScore(data.probability || 0.5, data.impact || 5);
    
    const assessment: IRiskAssessment = {
      id: `RISK-${Date.now()}`,
      name: data.name || "Unnamed Risk",
      category: data.category || RiskCategory.CYBER_THREAT,
      level: this.determineRiskLevel(score),
      score,
      probability: data.probability || 0.5,
      impact: data.impact || 5,
      mitigationStatus: "not_started",
      threats: data.threats || [],
      assets: data.assets || [],
      controls: data.controls || [],
      residualRisk: this.calculateResidualRisk(score, data.controls || []),
      owner: data.owner,
      assessedAt: new Date(),
      nextReviewDate: this.calculateNextReviewDate(score),
    };

    this.riskAssessments.set(assessment.id, assessment);
    this.logger.log(`Risk assessed: ${assessment.id} - ${assessment.name} (${assessment.level})`);

    return assessment;
  }

  async getRiskProfile(assetId?: string): Promise<{
    overallRiskScore: number;
    riskLevel: RiskLevel;
    risksByCategory: Record<RiskCategory, number>;
    topRisks: IRiskAssessment[];
    mitigationProgress: number;
  }> {
    let assessments = Array.from(this.riskAssessments.values());
    
    if (assetId) {
      assessments = assessments.filter(a => a.assets.includes(assetId));
    }

    const overallRiskScore = this.calculateOverallRisk(assessments);
    const riskLevel = this.determineRiskLevel(overallRiskScore);

    const risksByCategory = {} as Record<RiskCategory, number>;
    for (const category of Object.values(RiskCategory)) {
      const categoryRisks = assessments.filter(a => a.category === category);
      risksByCategory[category] = categoryRisks.length > 0
        ? categoryRisks.reduce((sum, r) => sum + r.score, 0) / categoryRisks.length
        : 0;
    }

    const topRisks = assessments
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const mitigated = assessments.filter(a => a.mitigationStatus === "completed").length;
    const mitigationProgress = assessments.length > 0 ? (mitigated / assessments.length) * 100 : 0;

    return {
      overallRiskScore,
      riskLevel,
      risksByCategory,
      topRisks,
      mitigationProgress,
    };
  }

  async createTreatmentPlan(riskId: string, plan: {
    strategy: "accept" | "mitigate" | "transfer" | "avoid";
    controls: IControl[];
    timeline: string;
    budget: number;
  }): Promise<IRiskAssessment> {
    const assessment = this.riskAssessments.get(riskId);
    if (!assessment) {
      throw new Error(`Risk assessment not found: ${riskId}`);
    }

    assessment.treatmentPlan = JSON.stringify(plan);
    assessment.controls = plan.controls;
    assessment.residualRisk = this.calculateResidualRisk(assessment.score, plan.controls);
    assessment.mitigationStatus = "in_progress";

    this.logger.log(`Treatment plan created for risk: ${riskId}`);
    return assessment;
  }

  async simulateRiskScenario(scenario: {
    name: string;
    threats: string[];
    controls: IControl[];
    targetAssets: string[];
  }): Promise<{
    scenario: string;
    estimatedProbability: number;
    estimatedImpact: number;
    riskScore: number;
    recommendedControls: IControl[];
  }> {
    this.logger.log(`Simulating risk scenario: ${scenario.name}`);

    // Analyze threats
    const threatIntel = await this.complexQueryService.executeComplexQuery("ThreatIntelligence", {
      where: { id: { $in: scenario.threats } },
    });

    // Calculate estimated risk
    const estimatedProbability = this.estimateProbability(threatIntel, scenario.controls);
    const estimatedImpact = this.estimateImpact(scenario.targetAssets);
    const riskScore = this.calculateRiskScore(estimatedProbability, estimatedImpact);

    // Recommend additional controls
    const recommendedControls = this.recommendControls(riskScore, scenario.controls);

    return {
      scenario: scenario.name,
      estimatedProbability,
      estimatedImpact,
      riskScore,
      recommendedControls,
    };
  }

  async generateRiskHeatmap(): Promise<IRiskMatrix[]> {
    const heatmap: IRiskMatrix[] = [];

    for (let prob = 0; prob <= 1; prob += 0.2) {
      for (let impact = 0; impact <= 10; impact += 2) {
        const score = this.calculateRiskScore(prob, impact);
        heatmap.push({
          probability: prob,
          impact,
          riskScore: score,
          level: this.determineRiskLevel(score),
        });
      }
    }

    return heatmap;
  }

  async trackRiskTrends(days: number = 30): Promise<{
    dates: Date[];
    scores: number[];
    levels: RiskLevel[];
  }> {
    const dates: Date[] = [];
    const scores: number[] = [];
    const levels: RiskLevel[] = [];

    // Mock historical data
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const score = 50 + Math.random() * 30; // Mock score
      
      dates.push(date);
      scores.push(score);
      levels.push(this.determineRiskLevel(score));
    }

    return { dates, scores, levels };
  }

  // Private helper methods

  private calculateRiskScore(probability: number, impact: number): number {
    // Risk Score = Probability (0-1) × Impact (0-10) × 10
    return probability * impact * 10;
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 80) return RiskLevel.CRITICAL;
    if (score >= 60) return RiskLevel.HIGH;
    if (score >= 40) return RiskLevel.MEDIUM;
    if (score >= 20) return RiskLevel.LOW;
    return RiskLevel.MINIMAL;
  }

  private calculateResidualRisk(inherentRisk: number, controls: IControl[]): number {
    let reduction = 0;
    
    for (const control of controls) {
      if (control.implemented) {
        reduction += control.effectiveness * 20;
      }
    }

    return Math.max(0, inherentRisk - reduction);
  }

  private calculateOverallRisk(assessments: IRiskAssessment[]): number {
    if (assessments.length === 0) return 0;
    
    // Weighted average with higher weight on critical risks
    const weighted = assessments.reduce((sum, r) => {
      const weight = r.level === RiskLevel.CRITICAL ? 3 : r.level === RiskLevel.HIGH ? 2 : 1;
      return sum + (r.score * weight);
    }, 0);

    const totalWeight = assessments.reduce((sum, r) => {
      return sum + (r.level === RiskLevel.CRITICAL ? 3 : r.level === RiskLevel.HIGH ? 2 : 1);
    }, 0);

    return weighted / totalWeight;
  }

  private calculateNextReviewDate(score: number): Date {
    const date = new Date();
    
    // Review frequency based on risk level
    if (score >= 80) {
      date.setMonth(date.getMonth() + 1); // Monthly for critical
    } else if (score >= 60) {
      date.setMonth(date.getMonth() + 3); // Quarterly for high
    } else {
      date.setMonth(date.getMonth() + 6); // Semi-annually for others
    }

    return date;
  }

  private estimateProbability(threats: any[], controls: IControl[]): number {
    let baseProbability = 0.7; // Start with 70% base probability
    
    // Reduce based on implemented controls
    for (const control of controls.filter(c => c.implemented)) {
      baseProbability *= (1 - control.effectiveness * 0.3);
    }

    return Math.max(0.05, Math.min(0.95, baseProbability));
  }

  private estimateImpact(assets: string[]): number {
    // Mock impact calculation based on number and criticality of assets
    return Math.min(10, assets.length * 2);
  }

  private recommendControls(riskScore: number, existingControls: IControl[]): IControl[] {
    const recommendations: IControl[] = [];

    if (riskScore >= 60) {
      recommendations.push({
        id: `CTRL-${Date.now()}-1`,
        name: "Multi-factor Authentication",
        type: "preventive",
        effectiveness: 0.8,
        implemented: false,
        cost: 50000,
      });

      recommendations.push({
        id: `CTRL-${Date.now()}-2`,
        name: "Security Information and Event Management (SIEM)",
        type: "detective",
        effectiveness: 0.7,
        implemented: false,
        cost: 200000,
      });
    }

    return recommendations;
  }
}

export { RiskManagementSystemsService };
