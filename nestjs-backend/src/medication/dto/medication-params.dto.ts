import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for medication ID path parameter
 */
export class MedicationIdParamDto {
  @ApiProperty({
    description: 'Medication UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/**
 * DTO for student ID path parameter
 */
export class StudentIdParamDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;
}
