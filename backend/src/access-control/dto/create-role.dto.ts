import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for creating a new role
 */
export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'School Nurse',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2, { message: 'Role name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Role name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'School nurse with access to student health management',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
