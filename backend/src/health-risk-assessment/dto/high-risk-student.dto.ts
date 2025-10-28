import { ApiProperty } from '@nestjs/swagger';
import { HealthRiskScoreDto } from './health-risk-score.dto';

/**
 * DTO for high-risk student response.
 * Combines student information with their risk assessment.
 */
export class HighRiskStudentDto {
  @ApiProperty({
    description: 'Student information',
  })
  student: any; // Will use actual Student model type

  @ApiProperty({
    description: 'Health risk assessment for the student',
    type: HealthRiskScoreDto,
  })
  assessment: HealthRiskScoreDto;
}
