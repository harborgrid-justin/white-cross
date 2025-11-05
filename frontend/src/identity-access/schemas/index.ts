/**
 * @fileoverview Identity Access - Schemas Barrel Export
 * @module identity-access/schemas
 * 
 * Note: user.role.schemas exported via namespace to avoid conflicts with role.schemas
 */

export * from './role.schemas';
export * from './role.crud.schemas';
export * from './role.operations.schemas';
export * from './role.permissions.schemas';
export * from './role.base.schemas';
// Namespace export to avoid Permission conflicts
export * as UserRoleSchemas from './user.role.schemas';
