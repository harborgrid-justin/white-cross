/**
 * WF-COMP-270 | adminSlice.ts - Admin Redux slice
 * Purpose: Admin page Redux slice with administration API integration
 * Related: administrationApi.ts, EntityApiService interface
 * Last Updated: 2025-10-21 | File Type: .ts
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { administrationApi } from '../../../services/modules/administrationApi';
import {
  User,
  District,
  School,
  License,
  SystemConfiguration,
  SystemHealth,
  BackupLog,
  TrainingModule,
  AuditLog,
  CreateUserData,
  UpdateUserData,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  CreateLicenseData,
  UpdateLicenseData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  ConfigurationData,
} from '../../../types/administration';
import { PaginatedResponse } from '../../../services/utils/apiUtils';

// Admin API Service Adapter
export class AdminApiService {
  // Users
  async getUsers(filters: any = {}) {
    return administrationApi.getUsers(filters);
  }

  async getUserById(id: string) {
    // Note: administrationApi doesn't have getUserById, so we'll filter users
    const response = await administrationApi.getUsers({ search: id });
    const user = response.data.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(userData: CreateUserData) {
    return administrationApi.createUser(userData);
  }

  async updateUser(id: string, userData: UpdateUserData) {
    return administrationApi.updateUser(id, userData);
  }

  async deleteUser(id: string) {
    return administrationApi.deleteUser(id);
  }

  // Districts
  async getDistricts(page: number = 1, limit: number = 20) {
    return administrationApi.getDistricts(page, limit);
  }

  async getDistrictById(id: string) {
    return administrationApi.getDistrictById(id);
  }

  async createDistrict(districtData: CreateDistrictData) {
    return administrationApi.createDistrict(districtData);
  }

  async updateDistrict(id: string, districtData: UpdateDistrictData) {
    return administrationApi.updateDistrict(id, districtData);
  }

  async deleteDistrict(id: string) {
    return administrationApi.deleteDistrict(id);
  }

  // Schools
  async getSchools(page: number = 1, limit: number = 20, districtId?: string) {
    return administrationApi.getSchools(page, limit, districtId);
  }

  async getSchoolById(id: string) {
    return administrationApi.getSchoolById(id);
  }

  async createSchool(schoolData: CreateSchoolData) {
    return administrationApi.createSchool(schoolData);
  }

  async updateSchool(id: string, schoolData: UpdateSchoolData) {
    return administrationApi.updateSchool(id, schoolData);
  }

  async deleteSchool(id: string) {
    return administrationApi.deleteSchool(id);
  }

  // System Configuration
  async getConfigurations(category?: string) {
    return administrationApi.getConfigurations(category as any);
  }

  async getConfigurationByKey(key: string) {
    return administrationApi.getConfigurationByKey(key);
  }

  async setConfiguration(configData: ConfigurationData, changedBy?: string) {
    return administrationApi.setConfiguration(configData, changedBy);
  }

  async deleteConfiguration(key: string) {
    return administrationApi.deleteConfiguration(key);
  }

  // System Health
  async getSystemHealth() {
    return administrationApi.getSystemHealth();
  }

  // Licenses
  async getLicenses(page: number = 1, limit: number = 20) {
    return administrationApi.getLicenses(page, limit);
  }

  async getLicenseById(id: string) {
    return administrationApi.getLicenseById(id);
  }

  async createLicense(licenseData: CreateLicenseData) {
    return administrationApi.createLicense(licenseData);
  }

  async updateLicense(id: string, licenseData: UpdateLicenseData) {
    return administrationApi.updateLicense(id, licenseData);
  }

  async deactivateLicense(id: string) {
    return administrationApi.deactivateLicense(id);
  }

  // Training Modules
  async getTrainingModules(category?: string) {
    return administrationApi.getTrainingModules(category as any);
  }

  async getTrainingModuleById(id: string) {
    return administrationApi.getTrainingModuleById(id);
  }

  async createTrainingModule(moduleData: CreateTrainingModuleData) {
    return administrationApi.createTrainingModule(moduleData);
  }

  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData) {
    return administrationApi.updateTrainingModule(id, moduleData);
  }

  async deleteTrainingModule(id: string) {
    return administrationApi.deleteTrainingModule(id);
  }

  // Backups
  async getBackupLogs(page: number = 1, limit: number = 20) {
    return administrationApi.getBackupLogs(page, limit);
  }

  async createBackup() {
    return administrationApi.createBackup();
  }

  // Audit Logs
  async getAuditLogs(filters: any = {}) {
    return administrationApi.getAuditLogs(filters);
  }

  // System Settings
  async getSettings() {
    return administrationApi.getSettings();
  }

  async updateSettings(settings: any[]) {
    return administrationApi.updateSettings(settings);
  }
}

// Create admin API service instance
export const adminApiService = new AdminApiService();

// State interface
export interface AdminState {
  // Users
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Districts
  districts: District[];
  districtsLoading: boolean;
  districtsError: string | null;
  
  // Schools
  schools: School[];
  schoolsLoading: boolean;
  schoolsError: string | null;
  
  // System Health
  systemHealth: SystemHealth | null;
  systemHealthLoading: boolean;
  systemHealthError: string | null;
  
  // Licenses
  licenses: License[];
  licensesLoading: boolean;
  licensesError: string | null;
  
  // Configurations
  configurations: SystemConfiguration[];
  configurationsLoading: boolean;
  configurationsError: string | null;
  
  // Training Modules
  trainingModules: TrainingModule[];
  trainingModulesLoading: boolean;
  trainingModulesError: string | null;
  
  // Backups
  backupLogs: BackupLog[];
  backupsLoading: boolean;
  backupsError: string | null;
  
  // Audit Logs
  auditLogs: AuditLog[];
  auditLogsLoading: boolean;
  auditLogsError: string | null;
  
  // Settings
  settings: any;
  settingsLoading: boolean;
  settingsError: string | null;
}

// Initial state
const initialState: AdminState = {
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  
  districts: [],
  districtsLoading: false,
  districtsError: null,
  
  schools: [],
  schoolsLoading: false,
  schoolsError: null,
  
  systemHealth: null,
  systemHealthLoading: false,
  systemHealthError: null,
  
  licenses: [],
  licensesLoading: false,
  licensesError: null,
  
  configurations: [],
  configurationsLoading: false,
  configurationsError: null,
  
  trainingModules: [],
  trainingModulesLoading: false,
  trainingModulesError: null,
  
  backupLogs: [],
  backupsLoading: false,
  backupsError: null,
  
  auditLogs: [],
  auditLogsLoading: false,
  auditLogsError: null,
  
  settings: null,
  settingsLoading: false,
  settingsError: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (filters: { page?: number; limit?: number; search?: string; role?: string; isActive?: boolean } = {}) => {
    const response = await adminApiService.getUsers(filters);
    return response;
  }
);

export const fetchDistricts = createAsyncThunk(
  'admin/fetchDistricts',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getDistricts(page, limit);
    return response;
  }
);

export const fetchSchools = createAsyncThunk(
  'admin/fetchSchools',
  async ({ page = 1, limit = 20, districtId }: { page?: number; limit?: number; districtId?: string } = {}) => {
    const response = await adminApiService.getSchools(page, limit, districtId);
    return response;
  }
);

export const fetchSystemHealth = createAsyncThunk(
  'admin/fetchSystemHealth',
  async () => {
    const response = await adminApiService.getSystemHealth();
    return response;
  }
);

export const fetchLicenses = createAsyncThunk(
  'admin/fetchLicenses',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getLicenses(page, limit);
    return response;
  }
);

export const fetchConfigurations = createAsyncThunk(
  'admin/fetchConfigurations',
  async (category?: string) => {
    const response = await adminApiService.getConfigurations(category);
    return response;
  }
);

export const fetchTrainingModules = createAsyncThunk(
  'admin/fetchTrainingModules',
  async (category?: string) => {
    const response = await adminApiService.getTrainingModules(category);
    return response;
  }
);

export const fetchBackupLogs = createAsyncThunk(
  'admin/fetchBackupLogs',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getBackupLogs(page, limit);
    return response;
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (filters: any = {}) => {
    const response = await adminApiService.getAuditLogs(filters);
    return response;
  }
);

export const fetchSettings = createAsyncThunk(
  'admin/fetchSettings',
  async () => {
    const response = await adminApiService.getSettings();
    return response;
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.usersError = null;
    },
    clearDistrictsError: (state) => {
      state.districtsError = null;
    },
    clearSchoolsError: (state) => {
      state.schoolsError = null;
    },
    clearSystemHealthError: (state) => {
      state.systemHealthError = null;
    },
    clearLicensesError: (state) => {
      state.licensesError = null;
    },
    clearConfigurationsError: (state) => {
      state.configurationsError = null;
    },
    clearTrainingModulesError: (state) => {
      state.trainingModulesError = null;
    },
    clearBackupsError: (state) => {
      state.backupsError = null;
    },
    clearAuditLogsError: (state) => {
      state.auditLogsError = null;
    },
    clearSettingsError: (state) => {
      state.settingsError = null;
    },
  },
  extraReducers: (builder) => {
    // Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.error.message || 'Failed to fetch users';
      })

    // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.districtsLoading = true;
        state.districtsError = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districtsLoading = false;
        state.districts = action.payload.data;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.districtsLoading = false;
        state.districtsError = action.error.message || 'Failed to fetch districts';
      })

    // Schools
      .addCase(fetchSchools.pending, (state) => {
        state.schoolsLoading = true;
        state.schoolsError = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.schoolsLoading = false;
        state.schools = action.payload.data;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.schoolsLoading = false;
        state.schoolsError = action.error.message || 'Failed to fetch schools';
      })

    // System Health
      .addCase(fetchSystemHealth.pending, (state) => {
        state.systemHealthLoading = true;
        state.systemHealthError = null;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.systemHealthLoading = false;
        state.systemHealth = action.payload;
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.systemHealthLoading = false;
        state.systemHealthError = action.error.message || 'Failed to fetch system health';
      })

    // Licenses
      .addCase(fetchLicenses.pending, (state) => {
        state.licensesLoading = true;
        state.licensesError = null;
      })
      .addCase(fetchLicenses.fulfilled, (state, action) => {
        state.licensesLoading = false;
        state.licenses = action.payload.data;
      })
      .addCase(fetchLicenses.rejected, (state, action) => {
        state.licensesLoading = false;
        state.licensesError = action.error.message || 'Failed to fetch licenses';
      })

    // Configurations
      .addCase(fetchConfigurations.pending, (state) => {
        state.configurationsLoading = true;
        state.configurationsError = null;
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.configurationsLoading = false;
        state.configurations = action.payload;
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.configurationsLoading = false;
        state.configurationsError = action.error.message || 'Failed to fetch configurations';
      })

    // Training Modules
      .addCase(fetchTrainingModules.pending, (state) => {
        state.trainingModulesLoading = true;
        state.trainingModulesError = null;
      })
      .addCase(fetchTrainingModules.fulfilled, (state, action) => {
        state.trainingModulesLoading = false;
        state.trainingModules = action.payload;
      })
      .addCase(fetchTrainingModules.rejected, (state, action) => {
        state.trainingModulesLoading = false;
        state.trainingModulesError = action.error.message || 'Failed to fetch training modules';
      })

    // Backup Logs
      .addCase(fetchBackupLogs.pending, (state) => {
        state.backupsLoading = true;
        state.backupsError = null;
      })
      .addCase(fetchBackupLogs.fulfilled, (state, action) => {
        state.backupsLoading = false;
        state.backupLogs = action.payload.data;
      })
      .addCase(fetchBackupLogs.rejected, (state, action) => {
        state.backupsLoading = false;
        state.backupsError = action.error.message || 'Failed to fetch backup logs';
      })

    // Audit Logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLogsLoading = true;
        state.auditLogsError = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogsLoading = false;
        state.auditLogs = action.payload.data;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLogsLoading = false;
        state.auditLogsError = action.error.message || 'Failed to fetch audit logs';
      })

    // Settings
      .addCase(fetchSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.error.message || 'Failed to fetch settings';
      });
  },
});

// Selectors
export const selectUsers = (state: { admin: AdminState }) => state.admin.users;
export const selectUsersLoading = (state: { admin: AdminState }) => state.admin.usersLoading;
export const selectUsersError = (state: { admin: AdminState }) => state.admin.usersError;
export const selectUsersPagination = (state: { admin: AdminState }) => state.admin.usersPagination;

export const selectDistricts = (state: { admin: AdminState }) => state.admin.districts;
export const selectDistrictsLoading = (state: { admin: AdminState }) => state.admin.districtsLoading;
export const selectDistrictsError = (state: { admin: AdminState }) => state.admin.districtsError;

export const selectSchools = (state: { admin: AdminState }) => state.admin.schools;
export const selectSchoolsLoading = (state: { admin: AdminState }) => state.admin.schoolsLoading;
export const selectSchoolsError = (state: { admin: AdminState }) => state.admin.schoolsError;

export const selectSystemHealth = (state: { admin: AdminState }) => state.admin.systemHealth;
export const selectSystemHealthLoading = (state: { admin: AdminState }) => state.admin.systemHealthLoading;
export const selectSystemHealthError = (state: { admin: AdminState }) => state.admin.systemHealthError;

export const selectLicenses = (state: { admin: AdminState }) => state.admin.licenses;
export const selectLicensesLoading = (state: { admin: AdminState }) => state.admin.licensesLoading;
export const selectLicensesError = (state: { admin: AdminState }) => state.admin.licensesError;

export const selectConfigurations = (state: { admin: AdminState }) => state.admin.configurations;
export const selectConfigurationsLoading = (state: { admin: AdminState }) => state.admin.configurationsLoading;
export const selectConfigurationsError = (state: { admin: AdminState }) => state.admin.configurationsError;

export const selectTrainingModules = (state: { admin: AdminState }) => state.admin.trainingModules;
export const selectTrainingModulesLoading = (state: { admin: AdminState }) => state.admin.trainingModulesLoading;
export const selectTrainingModulesError = (state: { admin: AdminState }) => state.admin.trainingModulesError;

export const selectBackupLogs = (state: { admin: AdminState }) => state.admin.backupLogs;
export const selectBackupsLoading = (state: { admin: AdminState }) => state.admin.backupsLoading;
export const selectBackupsError = (state: { admin: AdminState }) => state.admin.backupsError;

export const selectAuditLogs = (state: { admin: AdminState }) => state.admin.auditLogs;
export const selectAuditLogsLoading = (state: { admin: AdminState }) => state.admin.auditLogsLoading;
export const selectAuditLogsError = (state: { admin: AdminState }) => state.admin.auditLogsError;

export const selectSettings = (state: { admin: AdminState }) => state.admin.settings;
export const selectSettingsLoading = (state: { admin: AdminState }) => state.admin.settingsLoading;
export const selectSettingsError = (state: { admin: AdminState }) => state.admin.settingsError;

// Export actions and reducer
export const {
  clearUsersError,
  clearDistrictsError,
  clearSchoolsError,
  clearSystemHealthError,
  clearLicensesError,
  clearConfigurationsError,
  clearTrainingModulesError,
  clearBackupsError,
  clearAuditLogsError,
  clearSettingsError,
} = adminSlice.actions;

export default adminSlice.reducer;
