/**
 * Configuration Controller
 * Business logic for system configuration and school management
 * Handles system settings, school configuration, and feature flags
 */

import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta } from '../../../shared/utils';
import { AdministrationService } from '../../../../services/administration';
import { ConsentFormService } from '../../../../services/enterpriseFeatures';

/**
 * Configuration Controller Class
 * Handles system-wide configuration, school management, and feature flags
 */
export class ConfigurationController {

  /**
   * SYSTEM CONFIGURATION
   */

  /**
   * Get system configuration
   * GET /api/v1/system/config
   *
   * @description Returns current system configuration settings (ADMIN ONLY)
   * @param {AuthenticatedRequest} request - Authenticated admin request
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<ResponseObject>} System configuration with masked credentials
   */
  static async getSystemConfig(request: AuthenticatedRequest, h: ResponseToolkit) {
    const settings = await AdministrationService.getSystemSettings();

    return successResponse(h, { config: settings });
  }

  /**
   * Update system configuration
   * PUT /api/v1/system/config
   *
   * @description Updates system-wide configuration settings (ADMIN ONLY)
   * @param {AuthenticatedRequest} request - Request with settings payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<ResponseObject>} Updated configuration settings
   */
  static async updateSystemConfig(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { settings } = request.payload as any;

    // Convert settings object to array format expected by service
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      category: ConfigurationController.categorizeSettingKey(key)
    }));

    const updatedSettings = await AdministrationService.updateSystemSettings(settingsArray);

    return successResponse(h, {
      config: updatedSettings,
      message: `Updated ${settingsArray.length} configuration settings`
    });
  }

  /**
   * SCHOOL MANAGEMENT
   */

  /**
   * List schools in district
   * GET /api/v1/system/schools
   *
   * @description Returns paginated list of schools with optional filtering (ADMIN ONLY)
   * @param {AuthenticatedRequest} request - Request with pagination and filter params
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<ResponseObject>} Paginated school list
   */
  static async listSchools(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const { districtId, search } = request.query as any;

    // Get schools with optional district filter
    const result = await AdministrationService.getSchools(page, limit, districtId);

    // Apply search filter if provided
    let schools = result.schools || [];
    if (search) {
      const searchLower = search.toLowerCase();
      schools = schools.filter((school: any) =>
        school.name?.toLowerCase().includes(searchLower) ||
        school.code?.toLowerCase().includes(searchLower)
      );
    }

    return paginatedResponse(
      h,
      schools,
      buildPaginationMeta(page, limit, result.total || schools.length)
    );
  }

  /**
   * Get school by ID
   * GET /api/v1/system/schools/{schoolId}
   */
  static async getSchoolById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { schoolId } = request.params;
    const school = await AdministrationService.getSchoolById(schoolId);

    return successResponse(h, { school });
  }

  /**
   * Update school settings
   * PUT /api/v1/system/schools/{schoolId}
   */
  static async updateSchool(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { schoolId } = request.params;
    const updateData = request.payload;

    const school = await AdministrationService.updateSchool(schoolId, updateData);

    return successResponse(h, {
      school,
      message: 'School settings updated successfully'
    });
  }

  /**
   * FEATURE MANAGEMENT
   */

  /**
   * Get enabled features
   * GET /api/v1/system/features
   *
   * @description Returns current feature flag configuration
   * @param {AuthenticatedRequest} request - Authenticated request
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<ResponseObject>} Feature flags with enabled/disabled status
   */
  static async getFeatures(request: AuthenticatedRequest, h: ResponseToolkit) {
    // Get all system configurations related to features
    const configs = await AdministrationService.getAllConfigurations('GENERAL');

    // Extract feature flags
    const features = configs
      .filter((config: any) => config.key?.startsWith('feature.'))
      .reduce((acc: any, config: any) => {
        const featureName = config.key.replace('feature.', '');
        acc[featureName] = config.value === 'true' || config.value === true;
        return acc;
      }, {});

    return successResponse(h, {
      features,
      enabledCount: Object.values(features).filter(Boolean).length,
      totalCount: Object.keys(features).length
    });
  }

  /**
   * Update enabled features
   * PUT /api/v1/system/features
   *
   * @description Enables or disables system features (ADMIN ONLY)
   * @param {AuthenticatedRequest} request - Request with features array payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<ResponseObject>} Updated feature flags
   */
  static async updateFeatures(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { features } = request.payload as any;

    // Convert feature array to configuration updates
    const updates: any[] = [];
    const featureMap = [
      'MEDICATION_MANAGEMENT',
      'INCIDENT_REPORTING',
      'PARENT_PORTAL',
      'MOBILE_APP',
      'ANALYTICS_DASHBOARD',
      'INTEGRATION_SIS',
      'AUTOMATED_NOTIFICATIONS'
    ];

    for (const feature of featureMap) {
      updates.push({
        key: `feature.${feature.toLowerCase()}`,
        value: features.includes(feature) ? 'true' : 'false',
        category: 'GENERAL'
      });
    }

    await AdministrationService.updateSystemSettings(updates);

    return successResponse(h, {
      features,
      message: `Updated ${features.length} feature flags`
    });
  }

  /**
   * HELPER METHODS
   */

  /**
   * Categorize setting key to appropriate category
   */
  private static categorizeSettingKey(key: string): string {
    if (key.startsWith('smtp.') || key.startsWith('email.')) return 'NOTIFICATION';
    if (key.startsWith('security.') || key.startsWith('auth.')) return 'SECURITY';
    if (key.startsWith('backup.')) return 'BACKUP';
    if (key.startsWith('performance.')) return 'PERFORMANCE';
    if (key.startsWith('integration.')) return 'INTEGRATION';
    return 'GENERAL';
  }
}
