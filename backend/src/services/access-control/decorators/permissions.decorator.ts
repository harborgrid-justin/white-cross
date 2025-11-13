import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permission for a route
 * @param resource - The resource name (e.g., 'students', 'medications')
 * @param action - The action name (e.g., 'read', 'create', 'update', 'delete')
 *
 * @example
 * @Permissions('students', 'read')
 * @Get('/students')
 * getStudents() {}
 */
export const Permissions = (resource: string, action: string) =>
  SetMetadata(PERMISSIONS_KEY, { resource, action });
