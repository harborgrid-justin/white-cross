/**
 * LOC: EDU-DOWN-INSTITUTIONAL-RESEARCH-MOD-006
 * Institutional Research Module
 * Provides institutional research services and controllers
 */

import { Module } from '@nestjs/common';
import { InstitutionalResearchController } from './institutional-research-controller';
import { InstitutionalResearchService } from './institutional-research-service';

@Module({
  controllers: [InstitutionalResearchController],
  providers: [InstitutionalResearchService],
  exports: [InstitutionalResearchService],
})
export class InstitutionalResearchModule {}
