/**
 * @fileoverview Access Control Sessions Async Thunks
 * @module identity-access/stores/accessControl/thunks/sessionsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { accessControlApi } from '@/services/modules/accessControlApi';
import { UserSession } from '../../types/accessControl.types';

// ==========================================
// SESSIONS ASYNC THUNKS
// ==========================================

export const fetchUserSessions = createAsyncThunk<UserSession[], string, { rejectValue: string }>(
  'accessControl/fetchUserSessions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getUserSessions(userId);
      return response.sessions;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sessions';
      return rejectWithValue(message);
    }
  }
);

export const deleteSession = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/deleteSession',
  async (token, { rejectWithValue }) => {
    try {
      await accessControlApi.deleteSession(token);
      return token;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete session';
      return rejectWithValue(message);
    }
  }
);

export const deleteAllUserSessions = createAsyncThunk<void, string, { rejectValue: string }>(
  'accessControl/deleteAllUserSessions',
  async (userId, { rejectWithValue }) => {
    try {
      await accessControlApi.deleteAllUserSessions(userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete all user sessions';
      return rejectWithValue(message);
    }
  }
);
