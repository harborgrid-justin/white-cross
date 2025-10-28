import { Module } from '@nestjs/common';
import { HealthRiskAssessmentController } from './health-risk-assessment.controller';
import { HealthRiskAssessmentService } from './health-risk-assessment.service';

@Module({
  controllers: [HealthRiskAssessmentController],
  providers: [HealthRiskAssessmentService]
})
export class HealthRiskAssessmentModule {}
