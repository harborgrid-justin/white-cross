import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for revoking permission delegation
 */
export class RevokeDelegationDto {
  @ApiProperty({ description: 'Reason for revocation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
