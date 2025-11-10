/**
 * LOC: SECANALYTICS001
 * Purpose: Security event analysis and correlation
 */
import { Injectable } from "@nestjs/common";
import { JoinOperationsService } from "../join-operations-kit";

@Injectable()
export class SecurityAnalyticsPlatformService {
  constructor(private readonly joinService: JoinOperationsService) {}
  
  async correlateSecurityEvents(startDate: Date, endDate: Date): Promise<any> {
    return this.joinService.innerJoin("SecurityEvent", "ThreatIntelligence", "threatId", {
      where: { createdAt: { $between: [startDate, endDate] } },
    });
  }
}

export { SecurityAnalyticsPlatformService };
