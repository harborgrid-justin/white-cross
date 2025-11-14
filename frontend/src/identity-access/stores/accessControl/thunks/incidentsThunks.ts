/**
 * @fileoverview Access Control Security Incidents & IP Restrictions Async Thunks
 * @module identity-access/stores/accessControl/thunks/incidentsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { accessControlApi } from '@/services/modules/accessControlApi';
import {
  SecurityIncident,
  IpRestriction,
  AccessControlStatistics,
  CreateSecurityIncidentPayload,
  UpdateSecurityIncidentArgs,
  CreateIpRestrictionPayload,
  SecurityIncidentQueryParams,
  PaginationInfo,
} from '../../types/accessControl.types';

// ==========================================
// SECURITY INCIDENTS ASYNC THUNKS
// ==========================================

export const fetchSecurityIncidents = createAsyncThunk<
  { incidents: SecurityIncident[]; pagination?: PaginationInfo },
  SecurityIncidentQueryParams | undefined,
  { rejectValue: string }
>(
  'accessControl/fetchSecurityIncidents',
  async (params, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getSecurityIncidents(params);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch security incidents';
      return rejectWithValue(message);
    }
  }
);

export const createSecurityIncident = createAsyncThunk<
  SecurityIncident,
  CreateSecurityIncidentPayload,
  { rejectValue: string }
>(
  'accessControl/createSecurityIncident',
  async (incidentData, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.createSecurityIncident(incidentData);
      return response.incident;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create security incident';
      return rejectWithValue(message);
    }
  }
);

export const updateSecurityIncident = createAsyncThunk<
  SecurityIncident,
  UpdateSecurityIncidentArgs,
  { rejectValue: string }
>(
  'accessControl/updateSecurityIncident',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.updateSecurityIncident(id, updates);
      return response.incident;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update security incident';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// IP RESTRICTIONS ASYNC THUNKS
// ==========================================

export const fetchIpRestrictions = createAsyncThunk<IpRestriction[], void, { rejectValue: string }>(
  'accessControl/fetchIpRestrictions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.getIpRestrictions();
      return response.restrictions;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch IP restrictions';
      return rejectWithValue(message);
    }
  }
);

export const addIpRestriction = createAsyncThunk<
  IpRestriction,
  CreateIpRestrictionPayload,
  { rejectValue: string }
>(
  'accessControl/addIpRestriction',
  async (restrictionData, { rejectWithValue }) => {
    try {
      const response = await accessControlApi.addIpRestriction(restrictionData);
      return response.restriction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add IP restriction';
      return rejectWithValue(message);
    }
  }
);

export const removeIpRestriction = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/removeIpRestriction',
  async (id, { rejectWithValue }) => {
    try {
      await accessControlApi.removeIpRestriction(id);
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove IP restriction';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// STATISTICS ASYNC THUNKS
// ==========================================

export const fetchAccessControlStatistics = createAsyncThunk<
  AccessControlStatistics,
  void,
  { rejectValue: string }
>(
  'accessControl/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await accessControlApi.getStatistics();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch statistics';
      return rejectWithValue(message);
    }
  }
);
