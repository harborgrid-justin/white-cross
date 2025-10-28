import { IsString, IsEnum, IsOptional, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisitDisposition } from '../../enums/visit-disposition.enum';

/**
 * Check-Out DTO
 * Used for checking a student out of the clinic
 */
export class CheckOutDto {
  @ApiPropertyOptional({
    description: 'Treatment provided during visit',
    example: 'Administered acetaminophen 500mg, rest for 30 minutes',
  })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiProperty({
    description: 'Visit disposition/outcome',
    enum: VisitDisposition,
    example: VisitDisposition.RETURN_TO_CLASS,
  })
  @IsEnum(VisitDisposition)
  disposition: VisitDisposition;

  @ApiPropertyOptional({
    description: 'Classes missed during visit',
    example: ['Math 101', 'English 201'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classesMissed?: string[];

  @ApiPropertyOptional({
    description: 'Minutes of class time missed',
    example: 45,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minutesMissed?: number;

  @ApiPropertyOptional({
    description: 'Additional notes about check-out',
    example: 'Symptoms improved, parent notified',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
