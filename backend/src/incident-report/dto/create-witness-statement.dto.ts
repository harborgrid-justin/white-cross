import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WitnessType } from '../enums/witness-type.enum';

export class CreateWitnessStatementDto {
  @ApiProperty({
    description: 'Witness name (minimum 2 characters)',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2, { message: 'Witness name must be at least 2 characters' })
  witnessName: string;

  @ApiProperty({
    description: 'Witness type',
    enum: WitnessType,
    example: WitnessType.STAFF,
  })
  @IsEnum(WitnessType)
  witnessType: WitnessType;

  @ApiPropertyOptional({
    description: 'Witness contact information',
    example: 'john.doe@school.edu',
  })
  @IsOptional()
  @IsString()
  witnessContact?: string;

  @ApiProperty({
    description: 'Witness statement (minimum 20 characters)',
    example:
      'I saw the student fall from the playground equipment at approximately 10:30 AM',
  })
  @IsString()
  @MinLength(20, {
    message:
      'Witness statement must be at least 20 characters for proper documentation',
  })
  statement: string;
}
