/**
 * LOC: MQC001
 * File: /reuse/threat/composites/downstream/message-queue-consumers.ts
 */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ThreatEventConsumer {
  private readonly logger = new Logger(ThreatEventConsumer.name);
  
  async consumeThreatEvents(event: any) {
    this.logger.log('Processing threat event');
    return { processed: true };
  }
}

@Injectable()
export class IncidentEventConsumer {
  private readonly logger = new Logger(IncidentEventConsumer.name);
  
  async consumeIncidentEvents(event: any) {
    this.logger.log('Processing incident event');
    return { processed: true };
  }
}

export default { ThreatEventConsumer, IncidentEventConsumer };
