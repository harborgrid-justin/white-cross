import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO for checking if a user has a specific permission
 */
export class CheckPermissionDto {
  @ApiProperty({
    description: 'Resource to check permission for',
    example: 'students',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Action to check permission for',
    example: 'read',
  })
  @IsString()
  action: string;
}
