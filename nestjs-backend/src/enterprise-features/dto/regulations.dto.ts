import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackRegulationsDto {
  @ApiProperty({ description: 'State code (e.g., CA, TX)' })
  @IsString()
  state: string;
}

export class AssessImpactDto {
  @ApiProperty({ description: 'Regulation ID' })
  @IsString()
  regulationId: string;
}

export class RegulationUpdateResponseDto {
  id: string;
  state: string;
  category: string;
  title: string;
  description: string;
  effectiveDate: Date;
  impact: 'high' | 'medium' | 'low';
  actionRequired: string;
  status: 'pending-review' | 'implementing' | 'implemented';
}
