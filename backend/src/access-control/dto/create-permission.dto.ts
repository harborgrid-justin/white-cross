import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a new permission
 */
export class CreatePermissionDto {
  @ApiProperty({
    description: 'Resource the permission applies to',
    example: 'students',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Action allowed on the resource',
    example: 'read',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'View student records',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
