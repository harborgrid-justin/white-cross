import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransitionResultDto {
  @ApiProperty({
    description: 'Student ID',
    example: 'student-123',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Previous grade level',
    example: '8',
  })
  oldGrade: string;

  @ApiProperty({
    description: 'New grade level',
    example: '9',
  })
  newGrade: string;

  @ApiProperty({
    description: 'Whether the transition was successful',
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Error message if transition failed',
  })
  error?: string;
}

export class BulkTransitionResultDto {
  @ApiProperty({
    description: 'Total number of students processed',
  })
  total: number;

  @ApiProperty({
    description: 'Number of successful transitions',
  })
  successful: number;

  @ApiProperty({
    description: 'Number of failed transitions',
  })
  failed: number;

  @ApiProperty({
    description: 'Detailed results for each student',
    type: [TransitionResultDto],
  })
  results: TransitionResultDto[];
}
