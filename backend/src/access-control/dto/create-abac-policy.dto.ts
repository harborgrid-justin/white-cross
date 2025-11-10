import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AbacAttributeValue, AbacOperator } from '../interfaces/abac-policy.interface';

/**
 * DTO for ABAC Condition
 */
export class AbacConditionDto {
  @ApiProperty({ description: 'Attribute path', example: 'user.department' })
  @IsString()
  attribute: string;

  @ApiProperty({ description: 'Comparison operator', enum: AbacOperator })
  @IsEnum(AbacOperator)
  operator: AbacOperator;

  @ApiProperty({ description: 'Value to compare against' })
  value: AbacAttributeValue;
}

/**
 * DTO for creating ABAC policy rule
 */
export class CreateAbacPolicyDto {
  @ApiProperty({
    description: 'Policy name',
    example: 'Allow access during business hours',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Policy description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Policy effect', enum: ['allow', 'deny'] })
  @IsEnum(['allow', 'deny'])
  effect: 'allow' | 'deny';

  @ApiProperty({ description: 'Policy conditions', type: [AbacConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AbacConditionDto)
  conditions: AbacConditionDto[];

  @ApiProperty({
    description: 'Policy priority (higher = evaluated first)',
    example: 100,
  })
  @IsNumber()
  priority: number;

  @ApiProperty({ description: 'Whether policy is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
