import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransitionStudentDto {
  @ApiProperty({
    description: 'New grade level for the student',
    example: '9',
  })
  @IsString()
  @IsNotEmpty()
  newGrade: string;

  @ApiProperty({
    description: 'User ID who is performing the transition',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  transitionedBy: string;
}
