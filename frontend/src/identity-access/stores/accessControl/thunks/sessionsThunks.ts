/**
 * @fileoverview Access Control Sessions Async Thunks
 * @module identity-access/stores/accessControl/thunks/sessionsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserSessionsAction,
  deleteSessionAction,
  deleteAllUserSessionsAction,
  type UserSession,
} from '@/lib/actions/admin.access-control-sessions';
import type { UserSession as UserSessionType } from '../../types/accessControl.types';

// ==========================================
// SESSIONS ASYNC THUNKS
// ==========================================

export const fetchUserSessions = createAsyncThunk<UserSession[], string, { rejectValue: string }>(
  'accessControl/fetchUserSessions',
  async (userId, { rejectWithValue }) => {
    const result = await getUserSessionsAction(userId);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch sessions');
    }
    return result.data!;
  }
);

export const deleteSession = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/deleteSession',
  async (token, { rejectWithValue }) => {
    const result = await deleteSessionAction(token);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to delete session');
    }
    return result.data!;
  }
);

export const deleteAllUserSessions = createAsyncThunk<void, string, { rejectValue: string }>(
  'accessControl/deleteAllUserSessions',
  async (userId, { rejectWithValue }) => {
    const result = await deleteAllUserSessionsAction(userId);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to delete all user sessions');
    }
    return;
  }
);
