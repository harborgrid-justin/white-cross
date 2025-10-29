import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthRiskAssessmentController } from './health-risk-assessment.controller';
import { HealthRiskAssessmentService } from './health-risk-assessment.service';

// Models
import { Student } from '../database/models/student.model';
import { Allergy } from '../database/models/allergy.model';
import { ChronicCondition } from '../database/models/chronic-condition.model';
import { StudentMedication } from '../database/models/student-medication.model';
import { IncidentReport } from '../database/models/incident-report.model';

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
  providers: [HealthRiskAssessmentService]
})
export class HealthRiskAssessmentModule {}
