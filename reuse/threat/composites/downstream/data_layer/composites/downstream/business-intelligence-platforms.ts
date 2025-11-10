/**
 * LOC: BI001
 * Purpose: Business intelligence platform integration
 */
import { Injectable } from "@nestjs/common";
import { AnalyticsOperationsService } from "../analytics-operations-kit";
import { AggregationAnalyticsService } from "../aggregation-analytics-kit";

@Injectable()
export class BusinessIntelligenceService {
  constructor(
    private readonly analyticsService: AnalyticsOperationsService,
    private readonly aggregationService: AggregationAnalyticsService,
  ) {}
  
  async generateBIReport(model: string, dimensions: string[], metrics: string[]): Promise<any> {
    return this.aggregationService.aggregateByDimensions(model, dimensions, metrics, {});
  }
}

export { BusinessIntelligenceService };
