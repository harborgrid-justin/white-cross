/**
 * @fileoverview Access Control Roles Async Thunks
 * @module identity-access/stores/accessControl/thunks/rolesThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { accessControlApi } from '@/services/modules/accessControlApi';
import {
  Role,
  RolePermission,
  UserRole,
  CreateRolePayload,
  UpdateRoleArgs,
  AssignPermissionArgs,
  RemovePermissionArgs,
  AssignRoleArgs,
  RemoveRoleArgs,
} from '../../types/accessControl.types';

// ==========================================
// ROLES ASYNC THUNKS
// ==========================================

export const fetchRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  'accessControl/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getRoles();
      return response.roles;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch roles';
      return rejectWithValue(message);
    }
  }
);

export const fetchRoleById = createAsyncThunk<Role, string, { rejectValue: string }>(
  'accessControl/fetchRoleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getRoleById(id);
      return response.role;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch role';
      return rejectWithValue(message);
    }
  }
);

export const createRole = createAsyncThunk<Role, CreateRolePayload, { rejectValue: string }>(
  'accessControl/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.createRole(roleData);
      return response.role;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create role';
      return rejectWithValue(message);
    }
  }
);

export const updateRole = createAsyncThunk<
  Role,
  UpdateRoleArgs,
  { rejectValue: string }
>(
  'accessControl/updateRole',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.updateRole(id, updates);
      return response.role;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update role';
      return rejectWithValue(message);
    }
  }
);

export const deleteRole = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await accessControlApi.deleteRole(id);
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete role';
      return rejectWithValue(message);
    }
  }
);

export const initializeDefaultRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  'accessControl/initializeDefaultRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.initializeDefaultRoles();
      return response.roles;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize default roles';
      return rejectWithValue(message);
    }
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
    try {
      const response = await accessControlApi.assignPermissionToRole(roleId, permissionId);
      return response.rolePermission;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assign permission to role';
      return rejectWithValue(message);
    }
  }
);

export const removePermissionFromRole = createAsyncThunk<
  RemovePermissionArgs,
  RemovePermissionArgs,
  { rejectValue: string }
>(
  'accessControl/removePermissionFromRole',
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      await accessControlApi.removePermissionFromRole(roleId, permissionId);
      return { roleId, permissionId };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove permission from role';
      return rejectWithValue(message);
    }
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
    try {
      const response = await accessControlApi.assignRoleToUser(userId, roleId);
      return response.userRole;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assign role to user';
      return rejectWithValue(message);
    }
  }
);

export const removeRoleFromUser = createAsyncThunk<
  RemoveRoleArgs,
  RemoveRoleArgs,
  { rejectValue: string }
>(
  'accessControl/removeRoleFromUser',
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      await accessControlApi.removeRoleFromUser(userId, roleId);
      return { userId, roleId };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove role from user';
      return rejectWithValue(message);
    }
  }
);
