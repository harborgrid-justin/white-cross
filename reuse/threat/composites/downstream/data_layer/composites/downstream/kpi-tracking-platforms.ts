/**
 * LOC: KPI001
 * Purpose: KPI tracking and calculation
 */
import { Injectable } from "@nestjs/common";
import { MetricsCalculationService } from "../metrics-calculation-kit";

@Injectable()
export class KPITrackingService {
  constructor(private readonly metricsService: MetricsCalculationService) {}
  
  async trackKPI(name: string, model: string, calculation: any): Promise<any> {
    return this.metricsService.calculateCustomMetric(name, model, calculation);
  }
}

export { KPITrackingService };
