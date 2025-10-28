import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

/**
 * DTO for updating an existing role
 * All fields are optional
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
