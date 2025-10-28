import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * DTO for assigning a role to a user
 */
export class AssignRoleToUserDto {
  @ApiProperty({
    description: 'UUID of the role to assign',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  roleId: string;
}
