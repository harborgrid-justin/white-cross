import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Compliance Service
 * Handles compliance metrics and monitoring
 */
@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Get compliance metrics
   */
  getComplianceMetrics(): {
    hipaaCompliance: number;
    consentFormCompletion: number;
    immunizationCompliance: number;
    staffCertifications: number;
    documentRetention: number;
  } {
    try {
      // In production, query actual compliance data
      const metrics = {
        hipaaCompliance: 98.5,
        consentFormCompletion: 92.3,
        immunizationCompliance: 95.7,
        staffCertifications: 100,
        documentRetention: 97.2,
      };

      this.logger.log('Compliance metrics retrieved', metrics);

      // Emit compliance event if any metric is below threshold
      const lowMetrics = Object.entries(metrics).filter(([, value]) => value < 95);
      if (lowMetrics.length > 0) {
        this.eventEmitter.emit('analytics.compliance.warning', {
          lowMetrics: lowMetrics.map(([name, value]) => ({ name, value })),
          timestamp: new Date(),
        });
      }

      return metrics;
    } catch (error) {
      this.logger.error('Error getting compliance metrics', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}