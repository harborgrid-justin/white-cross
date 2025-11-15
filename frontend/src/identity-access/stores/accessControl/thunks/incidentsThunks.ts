/**
 * @fileoverview Access Control Security Incidents & IP Restrictions Async Thunks
 * @module identity-access/stores/accessControl/thunks/incidentsThunks
 * @category Access Control - Async Actions
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSecurityIncidentsAction,
  createSecurityIncidentAction,
  updateSecurityIncidentAction,
  getIpRestrictionsAction,
  addIpRestrictionAction,
  removeIpRestrictionAction,
  getAccessControlStatisticsAction,
  type SecurityIncident,
  type IpRestriction,
  type AccessControlStatistics,
  type CreateSecurityIncidentData,
  type UpdateSecurityIncidentArgs,
  type CreateIpRestrictionData,
  type SecurityIncidentQueryParams,
  type PaginationInfo,
} from '@/lib/actions/admin.access-control-incidents';
import type {
  SecurityIncident as SecurityIncidentType,
  IpRestriction as IpRestrictionType,
  AccessControlStatistics as AccessControlStatisticsType,
  CreateSecurityIncidentPayload,
  UpdateSecurityIncidentArgs as UpdateSecurityIncidentArgsType,
  CreateIpRestrictionPayload,
  SecurityIncidentQueryParams as SecurityIncidentQueryParamsType,
  PaginationInfo as PaginationInfoType,
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
    const result = await getSecurityIncidentsAction(params);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch security incidents');
    }
    return result.data!;
  }
);

export const createSecurityIncident = createAsyncThunk<
  SecurityIncident,
  CreateSecurityIncidentPayload,
  { rejectValue: string }
>(
  'accessControl/createSecurityIncident',
  async (incidentData, { rejectWithValue }) => {
    const result = await createSecurityIncidentAction(incidentData);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to create security incident');
    }
    return result.data!;
  }
);

export const updateSecurityIncident = createAsyncThunk<
  SecurityIncident,
  UpdateSecurityIncidentArgs,
  { rejectValue: string }
>(
  'accessControl/updateSecurityIncident',
  async ({ id, updates }, { rejectWithValue }) => {
    const result = await updateSecurityIncidentAction({ id, updates });
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to update security incident');
    }
    return result.data!;
  }
);

// ==========================================
// IP RESTRICTIONS ASYNC THUNKS
// ==========================================

export const fetchIpRestrictions = createAsyncThunk<IpRestriction[], void, { rejectValue: string }>(
  'accessControl/fetchIpRestrictions',
  async (_, { rejectWithValue }) => {
    const result = await getIpRestrictionsAction();
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch IP restrictions');
    }
    return result.data!;
  }
);

export const addIpRestriction = createAsyncThunk<
  IpRestriction,
  CreateIpRestrictionPayload,
  { rejectValue: string }
>(
  'accessControl/addIpRestriction',
  async (restrictionData, { rejectWithValue }) => {
    const result = await addIpRestrictionAction(restrictionData);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to add IP restriction');
    }
    return result.data!;
  }
);

export const removeIpRestriction = createAsyncThunk<string, string, { rejectValue: string }>(
  'accessControl/removeIpRestriction',
  async (id, { rejectWithValue }) => {
    const result = await removeIpRestrictionAction(id);
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to remove IP restriction');
    }
    return result.data!;
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
    const result = await getAccessControlStatisticsAction();
    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to fetch statistics');
    }
    return result.data!;
  }
);
