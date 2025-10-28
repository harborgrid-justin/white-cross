/**
 * Interface for user permissions result
 * Contains all roles and aggregated permissions for a user
 */
export interface UserPermissionsResult {
  roles: any[]; // Role models
  permissions: any[]; // Permission models
}
