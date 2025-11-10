/**
 * LOC: THREAT001
 * Purpose: Threat intelligence platform integration
 */
import { Injectable } from "@nestjs/common";
import { ComplexQueriesService } from "../complex-queries-kit";

@Injectable()
export class ThreatIntelligencePlatformService {
  constructor(private readonly complexQueryService: ComplexQueriesService) {}
  
  async analyzeThreatPatterns(filters: any): Promise<any> {
    return this.complexQueryService.executeComplexQuery("ThreatIntelligence", {
      where: filters,
      include: [{ all: true }],
    });
  }
}

export { ThreatIntelligencePlatformService };
