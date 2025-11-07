import { PartialType } from '@nestjs/swagger';
import { CreateWitnessStatementDto } from './create-witness-statement.dto';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWitnessStatementDto extends PartialType(CreateWitnessStatementDto) {
  @ApiPropertyOptional({
    description: 'Witness statement text',
    example: 'Updated witness statement with additional details',
  })
  @IsOptional()
  @IsString()
  statement?: string;

  @ApiPropertyOptional({
    description: 'Verification status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({
    description: 'Verified by user ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;
}
