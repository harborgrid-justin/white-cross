/**
 * @fileoverview Access Control Permissions Async Thunks
 * @module identity-access/stores/accessControl/thunks/permissionsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { accessControlApi } from '@/services/modules/accessControlApi';
import {
  Permission,
  CreatePermissionPayload,
  CheckPermissionArgs,
  PermissionCheckResult,
  UserPermissionsResponse,
} from '../../types/accessControl.types';

// ==========================================
// PERMISSIONS ASYNC THUNKS
// ==========================================

export const fetchPermissions = createAsyncThunk<Permission[], void, { rejectValue: string }>(
  'accessControl/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getPermissions();
      return response.permissions;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch permissions';
      return rejectWithValue(message);
    }
  }
);

export const createPermission = createAsyncThunk<
  Permission,
  CreatePermissionPayload,
  { rejectValue: string }
>(
  'accessControl/createPermission',
  async (permissionData, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.createPermission(permissionData);
      return response.permission;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create permission';
      return rejectWithValue(message);
    }
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
    try {
      return await accessControlApi.getUserPermissions(userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user permissions';
      return rejectWithValue(message);
    }
  }
);

export const checkUserPermission = createAsyncThunk<
  PermissionCheckResult,
  CheckPermissionArgs,
  { rejectValue: string }
>(
  'accessControl/checkUserPermission',
  async ({ userId, resource, action }, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.checkPermission(userId, resource, action);
      return { userId, resource, action, hasPermission: response.hasPermission };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check permission';
      return rejectWithValue(message);
    }
  }
);
