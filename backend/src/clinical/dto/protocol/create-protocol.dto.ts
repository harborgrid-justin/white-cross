import {
  IsString,
  IsUUID,
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProtocolStatus } from '../../enums/protocol-status.enum';

/**
 * Protocol step definition
 */
export class ProtocolStepDto {
  @ApiProperty({ description: 'Step order', example: 1 })
  order: number;

  @ApiProperty({ description: 'Step title', example: 'Initial Assessment' })
  title: string;

  @ApiProperty({
    description: 'Step description',
    example: 'Assess patient vital signs and symptoms',
  })
  description: string;

  @ApiProperty({ description: 'Is this step required?', default: true })
  required: boolean;
}

/**
 * Protocol decision point definition
 */
export class ProtocolDecisionPointDto {
  @ApiProperty({ description: 'Step number where decision occurs', example: 3 })
  step: number;

  @ApiProperty({
    description: 'Condition to evaluate',
    example: 'Temperature > 101°F',
  })
  condition: string;

  @ApiProperty({
    description: 'Action if condition is true',
    example: 'Proceed to fever protocol',
  })
  ifTrue: string;

  @ApiProperty({
    description: 'Action if condition is false',
    example: 'Continue with standard care',
  })
  ifFalse: string;
}

/**
 * DTO for creating a new clinical protocol
 */
export class CreateProtocolDto {
  @ApiProperty({
    description: 'Protocol name',
    example: 'Asthma Management Protocol',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unique protocol code', example: 'ASTHMA-001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Protocol version', example: '1.0' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Protocol category', example: 'Respiratory' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Detailed description of protocol' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Clinical indications for using this protocol',
    example: ['Acute asthma exacerbation', 'Wheezing'],
  })
  @IsArray()
  @IsString({ each: true })
  indications: string[];

  @ApiPropertyOptional({
    description: 'Contraindications',
    example: ['Severe respiratory distress'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  contraindications?: string[];

  @ApiProperty({ description: 'Protocol steps', type: [ProtocolStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProtocolStepDto)
  steps: ProtocolStepDto[];

  @ApiPropertyOptional({
    description: 'Decision points in protocol',
    type: [ProtocolDecisionPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProtocolDecisionPointDto)
  @IsOptional()
  decisionPoints?: ProtocolDecisionPointDto[];

  @ApiPropertyOptional({
    description: 'Required equipment',
    example: ['Peak flow meter', 'Nebulizer'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredEquipment?: string[];

  @ApiPropertyOptional({
    description: 'Medications used in protocol',
    example: ['Albuterol', 'Prednisone'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @ApiPropertyOptional({
    description: 'Initial status',
    enum: ProtocolStatus,
    default: ProtocolStatus.DRAFT,
  })
  @IsEnum(ProtocolStatus)
  @IsOptional()
  status?: ProtocolStatus;

  @ApiProperty({ description: 'Staff member creating protocol' })
  @IsUUID()
  createdBy: string;

  @ApiPropertyOptional({ description: 'Effective date for protocol' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  effectiveDate?: Date;

  @ApiPropertyOptional({ description: 'Next review date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  reviewDate?: Date;

  @ApiPropertyOptional({
    description: 'References and citations',
    example: ['NHLBI Guidelines 2020'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  references?: string[];

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    example: ['pediatric', 'emergency'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
