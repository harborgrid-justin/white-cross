/**
 * @fileoverview Access Control Roles Async Thunks
 * @module identity-access/stores/accessControl/thunks/rolesThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRolesAction,
  getRoleByIdAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  initializeDefaultRolesAction,
  assignPermissionToRoleAction,
  removePermissionFromRoleAction,
  assignRoleToUserAction,
  removeRoleFromUserAction,
  type Role,
  type RolePermission,
  type UserRole,
  type CreateRoleData,
  type UpdateRoleArgs,
  type AssignPermissionArgs,
  type RemovePermissionArgs,
  type AssignRoleArgs,
  type RemoveRoleArgs,
} from '@/lib/actions/admin.access-control-roles';
import type {
  Role as RoleType,
  RolePermission as RolePermissionType,
  UserRole as UserRoleType,
  CreateRolePayload,
  UpdateRoleArgs as UpdateRoleArgsType,
  AssignPermissionArgs as AssignPermissionArgsType,
  RemovePermissionArgs as RemovePermissionArgsType,
  AssignRoleArgs as AssignRoleArgsType,
  RemoveRoleArgs as RemoveRoleArgsType,
} from '../../types/accessControl.types';

// ==========================================
// ROLES ASYNC THUNKS
// ==========================================

export const fetchRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  'accessControl/fetchRoles',
  async (_, { rejectWithValue }) => {
    const result = await getRolesAction();
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch roles');
    }
    return result.data!;
  }
);

export const fetchRoleById = createAsyncThunk<Role, string, { rejectValue: string }>(
  'accessControl/fetchRoleById',
  async (id, { rejectWithValue }) => {
    const result = await getRoleByIdAction(id);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch role');
    }
    return result.data!;
  }
);

export const createRole = createAsyncThunk<Role, CreateRolePayload, { rejectValue: string }>(
  'accessControl/createRole',
  async (roleData, { rejectWithValue }) => {
    const result = await createRoleAction(roleData);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to create role');
    }
    return result.data!;
  }
);

export const updateRole = createAsyncThunk<
  Role,
  UpdateRoleArgs,
  { rejectValue: string }
>(
  'accessControl/updateRole',
  async ({ id, updates }, { rejectWithValue }) => {
    const result = await updateRoleAction({ id, updates });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to update role');
    }
    return result.data!;
  }
);

export const deleteRole = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/deleteRole',
  async (id, { rejectWithValue }) => {
    const result = await deleteRoleAction(id);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to delete role');
    }
    return result.data!;
  }
);

export const initializeDefaultRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  'accessControl/initializeDefaultRoles',
  async (_, { rejectWithValue }) => {
    const result = await initializeDefaultRolesAction();
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to initialize default roles');
    }
    return result.data!;
  }
);

// ==========================================
// ROLE-PERMISSION ASSIGNMENTS
// ==========================================

export const assignPermissionToRole = createAsyncThunk<
  RolePermission,
  AssignPermissionArgs,
  { rejectValue: string }
>(
  'accessControl/assignPermissionToRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    const result = await assignPermissionToRoleAction({ roleId, permissionId });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to assign permission to role');
    }
    return result.data!;
  }
);

export const removePermissionFromRole = createAsyncThunk<
  RemovePermissionArgs,
  RemovePermissionArgs,
  { rejectValue: string }
>(
  'accessControl/removePermissionFromRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    const result = await removePermissionFromRoleAction({ roleId, permissionId });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to remove permission from role');
    }
    return result.data!;
  }
);

// ==========================================
// USER-ROLE ASSIGNMENTS
// ==========================================

export const assignRoleToUser = createAsyncThunk<
  UserRole,
  AssignRoleArgs,
  { rejectValue: string }
>(
  'accessControl/assignRoleToUser',
  async ({ userId, roleId }, { rejectWithValue }) => {
    const result = await assignRoleToUserAction({ userId, roleId });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to assign role to user');
    }
    return result.data!;
  }
);

export const removeRoleFromUser = createAsyncThunk<
  RemoveRoleArgs,
  RemoveRoleArgs,
  { rejectValue: string }
>(
  'accessControl/removeRoleFromUser',
  async ({ userId, roleId }, { rejectWithValue }) => {
    const result = await removeRoleFromUserAction({ userId, roleId });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to remove role from user');
    }
    return result.data!;
  }
);
