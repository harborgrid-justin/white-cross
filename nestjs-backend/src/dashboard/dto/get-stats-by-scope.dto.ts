import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

/**
 * Query parameters for scoped dashboard statistics
 */
export class GetStatsByScopeDto {
  @ApiProperty({
    description: 'School ID to filter dashboard data',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  schoolId?: string;

  @ApiProperty({
    description: 'District ID to filter dashboard data',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  districtId?: string;
}
