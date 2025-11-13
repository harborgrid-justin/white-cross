import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

/**
 * DTO for assigning a permission to a role
 */
export class AssignPermissionToRoleDto {
  @ApiProperty({
    description: 'UUID of the permission to assign',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Permission ID must be a valid UUID' })
  permissionId: string;
}
