/**
 * @fileoverview Access Control State Definition
 * @module identity-access/stores/accessControl/state
 * @category Access Control - State Management
 */

import {
  Role,
  Permission,
  SecurityIncident,
  UserSession,
  IpRestriction,
  AccessControlStatistics,
  IncidentFilters,
  SessionFilters,
  PaginationInfo,
  Notification,
} from '../types/accessControl.types';

// ==========================================
// STATE INTERFACE
// ==========================================

export interface AccessControlState {
  roles: Role[];
  permissions: Permission[];
  securityIncidents: SecurityIncident[];
  sessions: UserSession[];
  ipRestrictions: IpRestriction[];
  statistics: AccessControlStatistics | null;
  selectedRole: Role | null;
  selectedPermission: Permission | null;
  selectedIncident: SecurityIncident | null;
  filters: {
    incidents: IncidentFilters;
    sessions: SessionFilters;
  };
  pagination: {
    roles: PaginationInfo;
    permissions: PaginationInfo;
    incidents: PaginationInfo;
    sessions: PaginationInfo;
  };
  loading: {
    roles: boolean;
    permissions: boolean;
    incidents: boolean;
    sessions: boolean;
    statistics: boolean;
    operations: boolean;
  };
  error: string | null;
  notifications: Notification[];
}

// ==========================================
// INITIAL STATE
// ==========================================

export const initialState: AccessControlState = {
  roles: [],
  permissions: [],
  securityIncidents: [],
  sessions: [],
  ipRestrictions: [],
  statistics: null,
  selectedRole: null,
  selectedPermission: null,
  selectedIncident: null,
  filters: {
    incidents: {},
    sessions: {},
  },
  pagination: {
    roles: { page: 1, limit: 20, total: 0 },
    permissions: { page: 1, limit: 20, total: 0 },
    incidents: { page: 1, limit: 20, total: 0 },
    sessions: { page: 1, limit: 20, total: 0 },
  },
  loading: {
    roles: false,
    permissions: false,
    incidents: false,
    sessions: false,
    statistics: false,
    operations: false,
  },
  error: null,
  notifications: [],
};
