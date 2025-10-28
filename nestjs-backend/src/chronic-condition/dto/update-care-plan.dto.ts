import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * DTO for updating a chronic condition care plan.
 */
export class UpdateCarePlanDto {
  @ApiProperty({
    description: 'Updated care plan documentation',
    example:
      'Updated care plan:\n1. Daily inhaler use before physical activity\n2. Monitor for symptoms during recess\n3. Emergency inhaler in nurse office',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  carePlan: string;
}
