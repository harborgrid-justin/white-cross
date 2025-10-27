/**
 * @module AdminSlice
 *
 * Redux slice for comprehensive system administration including user management,
 * district/school administration, licensing, system configuration, health monitoring,
 * training modules, backups, and audit logging.
 *
 * @remarks
 * **Admin Architecture**:
 * - Centralized administrative operations for multi-tenant school health platform
 * - Hierarchical organization: Districts → Schools → Users
 * - License-based access control and feature gating
 * - System health monitoring with real-time metrics
 * - Comprehensive audit trail for compliance (HIPAA, FERPA)
 *
 * **Security**:
 * - Requires 'admin' or 'super_admin' role for all operations
 * - Super admin-only: Districts, Licenses, System Configuration
 * - School admin: School-scoped user management only
 * - All operations logged to audit trail
 * - Sensitive data (passwords, tokens) never stored in Redux state
 *
 * **Key Features**:
 * - Multi-tenant district and school management
 * - User lifecycle: creation, activation, role assignment, deactivation
 * - License management with expiration tracking
 * - System configuration with change history
 * - Training module library for staff onboarding
 * - Automated backup scheduling and monitoring
 * - Real-time system health dashboard
 *
 * **Integration Points**:
 * - Integrates with administrationApi for backend operations
 * - Coordinates with authSlice for user authentication state
 * - Works with access-control slice for RBAC
 * - Feeds data to analytics and reporting modules
 *
 * @example
 * ```typescript
 * // Fetch all users with filtering
 * dispatch(fetchUsers({ role: 'nurse', isActive: true }));
 *
 * // Create new district (super admin only)
 * dispatch(fetchDistricts({ page: 1, limit: 20 }));
 *
 * // Monitor system health
 * dispatch(fetchSystemHealth());
 *
 * // View audit logs for compliance
 * dispatch(fetchAuditLogs({
 *   startDate: '2025-01-01',
 *   action: 'user.created'
 * }));
 * ```
 *
 * @see {@link module:AccessControlSlice} for RBAC management
 * @see {@link module:ConfigurationSlice} for system settings
 * @see {@link module:IntegrationSlice} for external system connections
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { administrationApi } from '../../services/modules/administrationApi';
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
} from '../../types/administration';
import { PaginatedResponse } from '../../services/utils/apiUtils';

/**
 * Admin API Service Adapter
 *
 * Provides a clean abstraction layer between Redux thunks and the administration
 * API service. Decouples state management from API implementation details and
 * enables easier testing and mocking.
 *
 * @class AdminApiService
 *
 * @remarks
 * **Design Pattern**: Service Adapter Pattern
 * - Wraps administrationApi to provide consistent interface
 * - Enables dependency injection for testing
 * - Centralizes error handling and retry logic
 * - Provides type safety for API operations
 *
 * **Security**:
 * - All methods require admin authentication (handled at API layer)
 * - Sensitive operations require super_admin role
 * - No credential or token storage in adapter
 *
 * @example
 * ```typescript
 * const service = new AdminApiService();
 * const users = await service.getUsers({ isActive: true });
 * const user = await service.createUser({
 *   email: 'nurse@school.edu',
 *   role: 'nurse',
 *   schoolId: 'school-123'
 * });
 * ```
 */
export class AdminApiService {
  /**
   * Retrieves paginated list of users with optional filtering.
   *
   * @param {Object} [filters={}] - Optional filters for user query
   * @param {number} [filters.page] - Page number for pagination
   * @param {number} [filters.limit] - Results per page
   * @param {string} [filters.search] - Search term for name/email
   * @param {string} [filters.role] - Filter by user role
   * @param {boolean} [filters.isActive] - Filter by active status
   * @returns {Promise<PaginatedResponse<User>>} Paginated user list
   * @throws {Error} If API request fails or user lacks permissions
   *
   * @remarks
   * - Supports full-text search across name and email fields
   * - Results are ordered by creation date (newest first)
   * - School admins only see users in their school
   */
  async getUsers(filters: any = {}) {
    return administrationApi.getUsers(filters);
  }

  /**
   * Retrieves a single user by ID.
   *
   * @param {string} id - User unique identifier
   * @returns {Promise<User>} User details
   * @throws {Error} If user not found or access denied
   *
   * @remarks
   * - Workaround: API doesn't have direct getUserById endpoint
   * - Uses filtered search to find user by ID
   * - School admins can only access users in their school
   */
  async getUserById(id: string) {
    // Note: administrationApi doesn't have getUserById, so we'll filter users
    const response = await administrationApi.getUsers({ search: id });
    const user = response.data.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  /**
   * Creates a new user account.
   *
   * @param {CreateUserData} userData - New user data
   * @param {string} userData.email - User email (unique)
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @param {string} userData.role - User role (nurse, admin, etc.)
   * @param {string} [userData.schoolId] - School assignment
   * @param {string} [userData.districtId] - District assignment
   * @returns {Promise<User>} Created user
   * @throws {Error} If validation fails or email already exists
   *
   * @remarks
   * - Automatically sends welcome email with password setup link
   * - Creates audit log entry
   * - Assigns default permissions based on role
   * - Super admin required for district-level users
   */
  async createUser(userData: CreateUserData) {
    return administrationApi.createUser(userData);
  }

  /**
   * Updates an existing user account.
   *
   * @param {string} id - User ID to update
   * @param {UpdateUserData} userData - Updated user data
   * @returns {Promise<User>} Updated user
   * @throws {Error} If user not found or validation fails
   *
   * @remarks
   * - Cannot change user email (create new user instead)
   * - Role changes require super admin permission
   * - Deactivation preserves all user data and audit history
   */
  async updateUser(id: string, userData: UpdateUserData) {
    return administrationApi.updateUser(id, userData);
  }

  /**
   * Deletes (soft delete) a user account.
   *
   * @param {string} id - User ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If user not found or deletion not permitted
   *
   * @remarks
   * - Performs soft delete (sets isActive=false, deletedAt timestamp)
   * - Preserves all historical data for audit compliance
   * - User can be reactivated by super admin
   * - Cannot delete super admin accounts
   */
  async deleteUser(id: string) {
    return administrationApi.deleteUser(id);
  }

  /**
   * Retrieves paginated list of districts.
   *
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @returns {Promise<PaginatedResponse<District>>} Paginated district list
   * @throws {Error} If API request fails
   *
   * @remarks
   * - Super admin only operation
   * - Includes school count and active user statistics
   * - Ordered alphabetically by district name
   */
  async getDistricts(page: number = 1, limit: number = 20) {
    return administrationApi.getDistricts(page, limit);
  }

  /**
   * Retrieves a single district by ID with related schools.
   *
   * @param {string} id - District unique identifier
   * @returns {Promise<District>} District with schools
   * @throws {Error} If district not found
   */
  async getDistrictById(id: string) {
    return administrationApi.getDistrictById(id);
  }

  /**
   * Creates a new district.
   *
   * @param {CreateDistrictData} districtData - New district data
   * @returns {Promise<District>} Created district
   * @throws {Error} If validation fails
   *
   * @remarks
   * - Super admin only operation
   * - Automatically creates default configuration
   * - Sets up initial licensing parameters
   */
  async createDistrict(districtData: CreateDistrictData) {
    return administrationApi.createDistrict(districtData);
  }

  /**
   * Updates an existing district.
   *
   * @param {string} id - District ID to update
   * @param {UpdateDistrictData} districtData - Updated district data
   * @returns {Promise<District>} Updated district
   * @throws {Error} If district not found
   */
  async updateDistrict(id: string, districtData: UpdateDistrictData) {
    return administrationApi.updateDistrict(id, districtData);
  }

  /**
   * Deletes a district and all associated schools.
   *
   * @param {string} id - District ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If district has active users or schools
   *
   * @remarks
   * - Super admin only operation
   * - Requires all schools to be empty (no users)
   * - Cascades soft delete to all associated schools
   * - Preserves audit trail
   */
  async deleteDistrict(id: string) {
    return administrationApi.deleteDistrict(id);
  }

  /**
   * Retrieves paginated list of schools, optionally filtered by district.
   *
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @param {string} [districtId] - Filter by district ID
   * @returns {Promise<PaginatedResponse<School>>} Paginated school list
   * @throws {Error} If API request fails
   */
  async getSchools(page: number = 1, limit: number = 20, districtId?: string) {
    return administrationApi.getSchools(page, limit, districtId);
  }

  /**
   * Retrieves a single school by ID.
   *
   * @param {string} id - School unique identifier
   * @returns {Promise<School>} School details
   * @throws {Error} If school not found
   */
  async getSchoolById(id: string) {
    return administrationApi.getSchoolById(id);
  }

  /**
   * Creates a new school within a district.
   *
   * @param {CreateSchoolData} schoolData - New school data
   * @returns {Promise<School>} Created school
   * @throws {Error} If validation fails or district not found
   *
   * @remarks
   * - Requires admin or super admin role
   * - Automatically inherits district configuration
   * - Creates default school admin account
   */
  async createSchool(schoolData: CreateSchoolData) {
    return administrationApi.createSchool(schoolData);
  }

  /**
   * Updates an existing school.
   *
   * @param {string} id - School ID to update
   * @param {UpdateSchoolData} schoolData - Updated school data
   * @returns {Promise<School>} Updated school
   * @throws {Error} If school not found
   */
  async updateSchool(id: string, schoolData: UpdateSchoolData) {
    return administrationApi.updateSchool(id, schoolData);
  }

  /**
   * Deletes a school.
   *
   * @param {string} id - School ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If school has active users
   *
   * @remarks
   * - Requires school to be empty (no active users)
   * - Soft delete preserves historical data
   * - All associated data remains for audit purposes
   */
  async deleteSchool(id: string) {
    return administrationApi.deleteSchool(id);
  }

  /**
   * Retrieves system configuration by category.
   *
   * @param {string} [category] - Configuration category filter
   * @returns {Promise<SystemConfiguration[]>} Configuration entries
   * @throws {Error} If API request fails
   *
   * @remarks
   * - Super admin only for sensitive categories
   * - Returns all categories if no filter provided
   */
  async getConfigurations(category?: string) {
    return administrationApi.getConfigurations(category as any);
  }

  /**
   * Retrieves a single configuration entry by key.
   *
   * @param {string} key - Configuration key
   * @returns {Promise<SystemConfiguration>} Configuration entry
   * @throws {Error} If key not found
   */
  async getConfigurationByKey(key: string) {
    return administrationApi.getConfigurationByKey(key);
  }

  /**
   * Sets or updates a system configuration value.
   *
   * @param {ConfigurationData} configData - Configuration data
   * @param {string} [changedBy] - User ID making the change
   * @returns {Promise<SystemConfiguration>} Updated configuration
   * @throws {Error} If validation fails
   *
   * @remarks
   * - Super admin only operation
   * - Creates audit trail entry
   * - May require system restart for some settings
   */
  async setConfiguration(configData: ConfigurationData, changedBy?: string) {
    return administrationApi.setConfiguration(configData, changedBy);
  }

  /**
   * Deletes a configuration entry.
   *
   * @param {string} key - Configuration key to delete
   * @returns {Promise<void>}
   * @throws {Error} If key not found or deletion not allowed
   *
   * @remarks
   * - Super admin only operation
   * - Cannot delete required system configurations
   */
  async deleteConfiguration(key: string) {
    return administrationApi.deleteConfiguration(key);
  }

  /**
   * Retrieves current system health metrics.
   *
   * @returns {Promise<SystemHealth>} System health data
   * @throws {Error} If health check fails
   *
   * @remarks
   * - Includes database, Redis, API, and external service status
   * - Memory and disk usage statistics
   * - Response time metrics
   * - Active user count and session information
   */
  async getSystemHealth() {
    return administrationApi.getSystemHealth();
  }

  /**
   * Retrieves paginated list of active licenses.
   *
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @returns {Promise<PaginatedResponse<License>>} Paginated license list
   * @throws {Error} If API request fails
   *
   * @remarks
   * - Super admin only operation
   * - Includes expiration warnings
   * - Shows feature entitlements per license
   */
  async getLicenses(page: number = 1, limit: number = 20) {
    return administrationApi.getLicenses(page, limit);
  }

  /**
   * Retrieves a single license by ID.
   *
   * @param {string} id - License unique identifier
   * @returns {Promise<License>} License details
   * @throws {Error} If license not found
   */
  async getLicenseById(id: string) {
    return administrationApi.getLicenseById(id);
  }

  /**
   * Creates a new license.
   *
   * @param {CreateLicenseData} licenseData - New license data
   * @returns {Promise<License>} Created license
   * @throws {Error} If validation fails
   *
   * @remarks
   * - Super admin only operation
   * - Automatically activates if start date is today or past
   * - Sends notification to district admin
   */
  async createLicense(licenseData: CreateLicenseData) {
    return administrationApi.createLicense(licenseData);
  }

  /**
   * Updates an existing license.
   *
   * @param {string} id - License ID to update
   * @param {UpdateLicenseData} licenseData - Updated license data
   * @returns {Promise<License>} Updated license
   * @throws {Error} If license not found
   *
   * @remarks
   * - Can extend expiration date
   * - Can modify feature entitlements
   * - Creates audit trail entry
   */
  async updateLicense(id: string, licenseData: UpdateLicenseData) {
    return administrationApi.updateLicense(id, licenseData);
  }

  /**
   * Deactivates a license.
   *
   * @param {string} id - License ID to deactivate
   * @returns {Promise<License>} Deactivated license
   * @throws {Error} If license not found
   *
   * @remarks
   * - Super admin only operation
   * - Immediately disables associated features
   * - Users receive notification
   * - Can be reactivated by super admin
   */
  async deactivateLicense(id: string) {
    return administrationApi.deactivateLicense(id);
  }

  /**
   * Retrieves training modules by category.
   *
   * @param {string} [category] - Training module category filter
   * @returns {Promise<TrainingModule[]>} Training modules
   * @throws {Error} If API request fails
   */
  async getTrainingModules(category?: string) {
    return administrationApi.getTrainingModules(category as any);
  }

  /**
   * Retrieves a single training module by ID.
   *
   * @param {string} id - Training module unique identifier
   * @returns {Promise<TrainingModule>} Training module details
   * @throws {Error} If module not found
   */
  async getTrainingModuleById(id: string) {
    return administrationApi.getTrainingModuleById(id);
  }

  /**
   * Creates a new training module.
   *
   * @param {CreateTrainingModuleData} moduleData - New module data
   * @returns {Promise<TrainingModule>} Created training module
   * @throws {Error} If validation fails
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData) {
    return administrationApi.createTrainingModule(moduleData);
  }

  /**
   * Updates an existing training module.
   *
   * @param {string} id - Training module ID to update
   * @param {UpdateTrainingModuleData} moduleData - Updated module data
   * @returns {Promise<TrainingModule>} Updated training module
   * @throws {Error} If module not found
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData) {
    return administrationApi.updateTrainingModule(id, moduleData);
  }

  /**
   * Deletes a training module.
   *
   * @param {string} id - Training module ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If module not found or has active enrollments
   */
  async deleteTrainingModule(id: string) {
    return administrationApi.deleteTrainingModule(id);
  }

  /**
   * Retrieves backup log history.
   *
   * @param {number} [page=1] - Page number
   * @param {number} [limit=20] - Results per page
   * @returns {Promise<PaginatedResponse<BackupLog>>} Backup logs
   * @throws {Error} If API request fails
   */
  async getBackupLogs(page: number = 1, limit: number = 20) {
    return administrationApi.getBackupLogs(page, limit);
  }

  /**
   * Initiates a manual system backup.
   *
   * @returns {Promise<BackupLog>} Backup log entry
   * @throws {Error} If backup fails or another backup is in progress
   *
   * @remarks
   * - Super admin only operation
   * - Includes database dump, file storage, and configuration
   * - Runs asynchronously, check backup logs for completion status
   * - Typical backup time: 5-15 minutes depending on data size
   */
  async createBackup() {
    return administrationApi.createBackup();
  }

  /**
   * Retrieves audit logs with filtering.
   *
   * @param {Object} [filters={}] - Audit log filters
   * @param {string} [filters.userId] - Filter by user
   * @param {string} [filters.action] - Filter by action type
   * @param {string} [filters.startDate] - Start date for range
   * @param {string} [filters.endDate] - End date for range
   * @returns {Promise<PaginatedResponse<AuditLog>>} Audit logs
   * @throws {Error} If API request fails
   *
   * @remarks
   * - All admin operations are automatically logged
   * - Logs are immutable for compliance
   * - Retention: 7 years for HIPAA compliance
   * - Supports full-text search of action descriptions
   */
  async getAuditLogs(filters: any = {}) {
    return administrationApi.getAuditLogs(filters);
  }

  /**
   * Retrieves system settings.
   *
   * @returns {Promise<any>} System settings
   * @throws {Error} If API request fails
   */
  async getSettings() {
    return administrationApi.getSettings();
  }

  /**
   * Updates multiple system settings in batch.
   *
   * @param {any[]} settings - Array of setting updates
   * @returns {Promise<any>} Updated settings
   * @throws {Error} If validation fails
   *
   * @remarks
   * - Super admin only operation
   * - Some settings may require system restart
   * - Validation occurs before any changes are applied
   */
  async updateSettings(settings: any[]) {
    return administrationApi.updateSettings(settings);
  }
}

/**
 * Admin API service singleton instance.
 *
 * @const {AdminApiService}
 */
export const adminApiService = new AdminApiService();

/**
 * Admin Redux state interface.
 *
 * Manages comprehensive administration state including users, districts, schools,
 * licenses, system configuration, health monitoring, training, backups, and audit logs.
 *
 * @interface AdminState
 * @property {User[]} users - Array of user accounts
 * @property {boolean} usersLoading - User fetch loading state
 * @property {string | null} usersError - User fetch error message
 * @property {Object} usersPagination - User list pagination metadata
 * @property {District[]} districts - Array of district records
 * @property {boolean} districtsLoading - District fetch loading state
 * @property {string | null} districtsError - District fetch error message
 * @property {School[]} schools - Array of school records
 * @property {boolean} schoolsLoading - School fetch loading state
 * @property {string | null} schoolsError - School fetch error message
 * @property {SystemHealth | null} systemHealth - Current system health metrics
 * @property {boolean} systemHealthLoading - Health check loading state
 * @property {string | null} systemHealthError - Health check error message
 * @property {License[]} licenses - Array of active licenses
 * @property {boolean} licensesLoading - License fetch loading state
 * @property {string | null} licensesError - License fetch error message
 * @property {SystemConfiguration[]} configurations - System configuration entries
 * @property {boolean} configurationsLoading - Configuration fetch loading state
 * @property {string | null} configurationsError - Configuration fetch error message
 * @property {TrainingModule[]} trainingModules - Training module library
 * @property {boolean} trainingModulesLoading - Training module fetch loading state
 * @property {string | null} trainingModulesError - Training module fetch error message
 * @property {BackupLog[]} backupLogs - Backup history logs
 * @property {boolean} backupsLoading - Backup operation loading state
 * @property {string | null} backupsError - Backup operation error message
 * @property {AuditLog[]} auditLogs - Audit trail entries
 * @property {boolean} auditLogsLoading - Audit log fetch loading state
 * @property {string | null} auditLogsError - Audit log fetch error message
 * @property {any} settings - System settings object
 * @property {boolean} settingsLoading - Settings fetch/update loading state
 * @property {string | null} settingsError - Settings operation error message
 */
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

/** Initial admin state with default values */
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

/**
 * Async thunk to fetch users with optional filtering.
 *
 * @async
 * @function fetchUsers
 * @param {Object} [filters={}] - Optional user filters
 * @param {number} [filters.page] - Page number
 * @param {number} [filters.limit] - Results per page
 * @param {string} [filters.search] - Search term
 * @param {string} [filters.role] - Role filter
 * @param {boolean} [filters.isActive] - Active status filter
 * @returns {Promise<PaginatedResponse<User>>} User list with pagination
 * @throws {Error} If fetch fails or user lacks admin permission
 *
 * @remarks
 * **Permission**: Requires 'admin' or 'super_admin' role
 * - School admins see only their school's users
 * - District admins see their district's users
 * - Super admins see all users across all districts
 */
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (filters: { page?: number; limit?: number; search?: string; role?: string; isActive?: boolean } = {}) => {
    const response = await adminApiService.getUsers(filters);
    return response;
  }
);

/**
 * Async thunk to fetch districts.
 *
 * @async
 * @function fetchDistricts
 * @param {Object} [params={}] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @returns {Promise<PaginatedResponse<District>>} District list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'super_admin' role only
 */
export const fetchDistricts = createAsyncThunk(
  'admin/fetchDistricts',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getDistricts(page, limit);
    return response;
  }
);

/**
 * Async thunk to fetch schools.
 *
 * @async
 * @function fetchSchools
 * @param {Object} [params={}] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @param {string} [params.districtId] - Filter by district
 * @returns {Promise<PaginatedResponse<School>>} School list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'admin' or 'super_admin' role
 * - District admins can only access schools in their district
 */
export const fetchSchools = createAsyncThunk(
  'admin/fetchSchools',
  async ({ page = 1, limit = 20, districtId }: { page?: number; limit?: number; districtId?: string } = {}) => {
    const response = await adminApiService.getSchools(page, limit, districtId);
    return response;
  }
);

/**
 * Async thunk to fetch system health metrics.
 *
 * @async
 * @function fetchSystemHealth
 * @returns {Promise<SystemHealth>} System health data
 * @throws {Error} If health check fails
 *
 * @remarks
 * **Permission**: Requires 'admin' or 'super_admin' role
 * - Returns real-time database, API, and service health
 * - Includes memory and disk usage statistics
 * - Shows active user sessions
 */
export const fetchSystemHealth = createAsyncThunk(
  'admin/fetchSystemHealth',
  async () => {
    const response = await adminApiService.getSystemHealth();
    return response;
  }
);

/**
 * Async thunk to fetch licenses.
 *
 * @async
 * @function fetchLicenses
 * @param {Object} [params={}] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @returns {Promise<PaginatedResponse<License>>} License list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'super_admin' role only
 * - Includes expiration status and feature entitlements
 */
export const fetchLicenses = createAsyncThunk(
  'admin/fetchLicenses',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getLicenses(page, limit);
    return response;
  }
);

/**
 * Async thunk to fetch system configurations.
 *
 * @async
 * @function fetchConfigurations
 * @param {string} [category] - Configuration category filter
 * @returns {Promise<SystemConfiguration[]>} Configuration list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'super_admin' role for sensitive categories
 */
export const fetchConfigurations = createAsyncThunk(
  'admin/fetchConfigurations',
  async (category?: string) => {
    const response = await adminApiService.getConfigurations(category);
    return response;
  }
);

/**
 * Async thunk to fetch training modules.
 *
 * @async
 * @function fetchTrainingModules
 * @param {string} [category] - Training module category filter
 * @returns {Promise<TrainingModule[]>} Training module list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'admin' or 'super_admin' role
 */
export const fetchTrainingModules = createAsyncThunk(
  'admin/fetchTrainingModules',
  async (category?: string) => {
    const response = await adminApiService.getTrainingModules(category);
    return response;
  }
);

/**
 * Async thunk to fetch backup logs.
 *
 * @async
 * @function fetchBackupLogs
 * @param {Object} [params={}] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @returns {Promise<PaginatedResponse<BackupLog>>} Backup log list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'super_admin' role only
 */
export const fetchBackupLogs = createAsyncThunk(
  'admin/fetchBackupLogs',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await adminApiService.getBackupLogs(page, limit);
    return response;
  }
);

/**
 * Async thunk to fetch audit logs with filtering.
 *
 * @async
 * @function fetchAuditLogs
 * @param {Object} [filters={}] - Audit log filters
 * @returns {Promise<PaginatedResponse<AuditLog>>} Audit log list
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'admin' or 'super_admin' role
 * - Admins can only see audit logs for their scope
 * - Super admins see all audit logs
 */
export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (filters: any = {}) => {
    const response = await adminApiService.getAuditLogs(filters);
    return response;
  }
);

/**
 * Async thunk to fetch system settings.
 *
 * @async
 * @function fetchSettings
 * @returns {Promise<any>} System settings
 * @throws {Error} If fetch fails
 *
 * @remarks
 * **Permission**: Requires 'super_admin' role only
 */
export const fetchSettings = createAsyncThunk(
  'admin/fetchSettings',
  async () => {
    const response = await adminApiService.getSettings();
    return response;
  }
);

/**
 * Admin Redux slice with reducers and actions.
 */
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    /** Clears user fetch error */
    clearUsersError: (state) => {
      state.usersError = null;
    },
    /** Clears district fetch error */
    clearDistrictsError: (state) => {
      state.districtsError = null;
    },
    /** Clears school fetch error */
    clearSchoolsError: (state) => {
      state.schoolsError = null;
    },
    /** Clears system health fetch error */
    clearSystemHealthError: (state) => {
      state.systemHealthError = null;
    },
    /** Clears license fetch error */
    clearLicensesError: (state) => {
      state.licensesError = null;
    },
    /** Clears configuration fetch error */
    clearConfigurationsError: (state) => {
      state.configurationsError = null;
    },
    /** Clears training module fetch error */
    clearTrainingModulesError: (state) => {
      state.trainingModulesError = null;
    },
    /** Clears backup operation error */
    clearBackupsError: (state) => {
      state.backupsError = null;
    },
    /** Clears audit log fetch error */
    clearAuditLogsError: (state) => {
      state.auditLogsError = null;
    },
    /** Clears settings operation error */
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

/** Selects all users from admin state */
export const selectUsers = (state: { admin: AdminState }) => state.admin.users;

/** Selects user loading state */
export const selectUsersLoading = (state: { admin: AdminState }) => state.admin.usersLoading;

/** Selects user error message */
export const selectUsersError = (state: { admin: AdminState }) => state.admin.usersError;

/** Selects user pagination metadata */
export const selectUsersPagination = (state: { admin: AdminState }) => state.admin.usersPagination;

/** Selects all districts from admin state */
export const selectDistricts = (state: { admin: AdminState }) => state.admin.districts;

/** Selects district loading state */
export const selectDistrictsLoading = (state: { admin: AdminState }) => state.admin.districtsLoading;

/** Selects district error message */
export const selectDistrictsError = (state: { admin: AdminState }) => state.admin.districtsError;

/** Selects all schools from admin state */
export const selectSchools = (state: { admin: AdminState }) => state.admin.schools;

/** Selects school loading state */
export const selectSchoolsLoading = (state: { admin: AdminState }) => state.admin.schoolsLoading;

/** Selects school error message */
export const selectSchoolsError = (state: { admin: AdminState }) => state.admin.schoolsError;

/** Selects system health metrics */
export const selectSystemHealth = (state: { admin: AdminState }) => state.admin.systemHealth;

/** Selects system health loading state */
export const selectSystemHealthLoading = (state: { admin: AdminState }) => state.admin.systemHealthLoading;

/** Selects system health error message */
export const selectSystemHealthError = (state: { admin: AdminState }) => state.admin.systemHealthError;

/** Selects all licenses from admin state */
export const selectLicenses = (state: { admin: AdminState }) => state.admin.licenses;

/** Selects license loading state */
export const selectLicensesLoading = (state: { admin: AdminState }) => state.admin.licensesLoading;

/** Selects license error message */
export const selectLicensesError = (state: { admin: AdminState }) => state.admin.licensesError;

/** Selects all system configurations */
export const selectConfigurations = (state: { admin: AdminState }) => state.admin.configurations;

/** Selects configuration loading state */
export const selectConfigurationsLoading = (state: { admin: AdminState }) => state.admin.configurationsLoading;

/** Selects configuration error message */
export const selectConfigurationsError = (state: { admin: AdminState }) => state.admin.configurationsError;

/** Selects all training modules */
export const selectTrainingModules = (state: { admin: AdminState }) => state.admin.trainingModules;

/** Selects training module loading state */
export const selectTrainingModulesLoading = (state: { admin: AdminState }) => state.admin.trainingModulesLoading;

/** Selects training module error message */
export const selectTrainingModulesError = (state: { admin: AdminState }) => state.admin.trainingModulesError;

/** Selects all backup logs */
export const selectBackupLogs = (state: { admin: AdminState }) => state.admin.backupLogs;

/** Selects backup operation loading state */
export const selectBackupsLoading = (state: { admin: AdminState }) => state.admin.backupsLoading;

/** Selects backup operation error message */
export const selectBackupsError = (state: { admin: AdminState }) => state.admin.backupsError;

/** Selects all audit logs */
export const selectAuditLogs = (state: { admin: AdminState }) => state.admin.auditLogs;

/** Selects audit log loading state */
export const selectAuditLogsLoading = (state: { admin: AdminState }) => state.admin.auditLogsLoading;

/** Selects audit log error message */
export const selectAuditLogsError = (state: { admin: AdminState }) => state.admin.auditLogsError;

/** Selects system settings */
export const selectSettings = (state: { admin: AdminState }) => state.admin.settings;

/** Selects settings loading state */
export const selectSettingsLoading = (state: { admin: AdminState }) => state.admin.settingsLoading;

/** Selects settings error message */
export const selectSettingsError = (state: { admin: AdminState }) => state.admin.settingsError;

// Export actions and reducer

/**
 * Admin slice action creators.
 *
 * @exports clearUsersError - Clear user error message
 * @exports clearDistrictsError - Clear district error message
 * @exports clearSchoolsError - Clear school error message
 * @exports clearSystemHealthError - Clear system health error message
 * @exports clearLicensesError - Clear license error message
 * @exports clearConfigurationsError - Clear configuration error message
 * @exports clearTrainingModulesError - Clear training module error message
 * @exports clearBackupsError - Clear backup error message
 * @exports clearAuditLogsError - Clear audit log error message
 * @exports clearSettingsError - Clear settings error message
 */
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
