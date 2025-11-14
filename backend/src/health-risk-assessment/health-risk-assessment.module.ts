import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthRiskAssessmentController } from './health-risk-assessment.controller';
import { HealthRiskAssessmentService } from './health-risk-assessment.service';

// Models
import { Student } from '@/database/models';
import { Allergy } from '@/database/models';
import { ChronicCondition } from '@/database/models';
import { StudentMedication } from '@/database/models';
import { IncidentReport } from '@/database/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Student,
      Allergy,
      ChronicCondition,
      StudentMedication,
      IncidentReport,
    ]),
  ],
  controllers: [HealthRiskAssessmentController],
  providers: [HealthRiskAssessmentService],
})
export class HealthRiskAssessmentModule {}
