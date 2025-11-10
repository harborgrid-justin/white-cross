/**
 * LOC: EDU-DOWN-COMMUNICATION-MOD-008
 * Communication Module
 * Provides communication services and controllers
 */

import { Module } from '@nestjs/common';
import { CommunicationController } from './communication-controller';
import { CommunicationService } from './communication-service';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
