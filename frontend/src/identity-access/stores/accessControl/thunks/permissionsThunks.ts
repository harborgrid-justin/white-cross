/**
 * @fileoverview Access Control Permissions Async Thunks
 * @module identity-access/stores/accessControl/thunks/permissionsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPermissionsAction,
  createPermissionAction,
  getUserPermissionsAction,
  checkUserPermissionAction,
  type Permission,
  type CreatePermissionData,
  type CheckPermissionArgs,
  type PermissionCheckResult,
  type UserPermissionsResponse,
} from '@/lib/actions/admin.access-control-permissions';
import type {
  Permission as PermissionType,
  CreatePermissionPayload,
  CheckPermissionArgs as CheckPermissionArgsType,
  PermissionCheckResult as PermissionCheckResultType,
  UserPermissionsResponse as UserPermissionsResponseType,
} from '../../types/accessControl.types';

// ==========================================
// PERMISSIONS ASYNC THUNKS
// ==========================================

export const fetchPermissions = createAsyncThunk<Permission[], void, { rejectValue: string }>(
  'accessControl/fetchPermissions',
  async (_, { rejectWithValue }) => {
    const result = await getPermissionsAction();
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch permissions');
    }
    return result.data!;
  }
);

export const createPermission = createAsyncThunk<
  Permission,
  CreatePermissionPayload,
  { rejectValue: string }
>(
  'accessControl/createPermission',
  async (permissionData, { rejectWithValue }) => {
    const result = await createPermissionAction(permissionData);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to create permission');
    }
    return result.data!;
  }
);

// ==========================================
// USER PERMISSIONS
// ==========================================

export const fetchUserPermissions = createAsyncThunk<
  UserPermissionsResponse,
  string,
  { rejectValue: string }
>(
  'accessControl/fetchUserPermissions',
  async (userId, { rejectWithValue }) => {
    const result = await getUserPermissionsAction(userId);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch user permissions');
    }
    return result.data!;
  }
);

export const checkUserPermission = createAsyncThunk<
  PermissionCheckResult,
  CheckPermissionArgs,
  { rejectValue: string }
>(
  'accessControl/checkUserPermission',
  async ({ userId, resource, action }, { rejectWithValue }) => {
    const result = await checkUserPermissionAction({ userId, resource, action });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to check permission');
    }
    return result.data!;
  }
);
