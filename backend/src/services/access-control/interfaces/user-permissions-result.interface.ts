import { PermissionModel, RoleModel } from '../types/sequelize-models.types';

/**
 * Interface for user permissions result
 * Contains all roles and aggregated permissions for a user
 */
export interface UserPermissionsResult {
  roles: RoleModel[];
  permissions: PermissionModel[];
}
