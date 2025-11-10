/**
 * LOC: EXEC001
 * Purpose: Executive dashboard KPIs and summaries
 */
import { Injectable } from "@nestjs/common";
import { MetricsCalculationService } from "../metrics-calculation-kit";

@Injectable()
export class ExecutiveDashboardService {
  constructor(private readonly metricsService: MetricsCalculationService) {}
  
  async getExecutiveSummary(): Promise<any> {
    return {
      kpis: await this.metricsService.calculateKPIs("all", {}),
      trends: await this.metricsService.calculateTrends("all", 30),
      alerts: [],
    };
  }
}

export { ExecutiveDashboardService };
