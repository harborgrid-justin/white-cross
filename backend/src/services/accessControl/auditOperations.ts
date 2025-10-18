/**
 * WC-GEN-175 | auditOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Security Audit Operations
 *
 * This module handles security incident management, audit trails,
 * and security statistics for monitoring and compliance purposes.
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  SecurityIncident,
  Session,
  LoginAttempt,
  IpRestriction,
  Role,
  Permission,
  RolePermission,
  sequelize
} from '../../database/models';
import {
  SecurityIncidentType,
  IncidentSeverity,
  SecurityIncidentStatus
} from '../../database/types/enums';
import {
  CreateSecurityIncidentData,
  UpdateSecurityIncidentData,
  SecurityIncidentFilters,
  SecurityStatistics
} from './types';

/**
 * Security Incident Management
 */

/**
 * Create a security incident record
 */
export async function createSecurityIncident(data: CreateSecurityIncidentData): Promise<SecurityIncident> {
  try {
    const incident = await SecurityIncident.create({
      type: data.type,
      severity: data.severity,
      description: data.description,
      affectedResources: data.affectedResources || [],
      detectedBy: data.detectedBy,
      status: SecurityIncidentStatus.OPEN
    });

    logger.warn(`Security incident created: ${incident.id} - ${data.type}`);
    return incident;
  } catch (error) {
    logger.error('Error creating security incident:', error);
    throw error;
  }
}

/**
 * Update a security incident
 */
export async function updateSecurityIncident(
  id: string,
  data: UpdateSecurityIncidentData
): Promise<SecurityIncident> {
  try {
    const incident = await SecurityIncident.findByPk(id);

    if (!incident) {
      throw new Error('Security incident not found');
    }

    const updateData: any = {};

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.resolution) {
      updateData.resolution = data.resolution;
    }

    if (data.resolvedBy) {
      updateData.resolvedBy = data.resolvedBy;
    }

    // Automatically set resolvedAt when status changes to RESOLVED
    if (data.status === SecurityIncidentStatus.RESOLVED && !incident.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    await incident.update(updateData);

    logger.info(`Updated security incident: ${id}`);
    return incident;
  } catch (error) {
    logger.error(`Error updating security incident ${id}:`, error);
    throw error;
  }
}

/**
 * Get security incidents with pagination and filtering
 */
export async function getSecurityIncidents(
  page: number = 1,
  limit: number = 20,
  filters: SecurityIncidentFilters = {}
): Promise<{
  incidents: SecurityIncident[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  try {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.severity) {
      whereClause.severity = filters.severity;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    const { rows: incidents, count: total } = await SecurityIncident.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    logger.info(`Retrieved ${incidents.length} security incidents`);

    return {
      incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error getting security incidents:', error);
    throw error;
  }
}

/**
 * Security Statistics and Monitoring
 */

/**
 * Get comprehensive security statistics
 */
export async function getSecurityStatistics(): Promise<SecurityStatistics> {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalIncidents,
      openIncidents,
      criticalIncidents,
      recentFailedLogins,
      activeSessions,
      activeIpRestrictions
    ] = await Promise.all([
      SecurityIncident.count(),
      SecurityIncident.count({
        where: { status: SecurityIncidentStatus.OPEN }
      }),
      SecurityIncident.count({
        where: {
          severity: IncidentSeverity.CRITICAL,
          status: {
            [Op.ne]: SecurityIncidentStatus.CLOSED
          }
        }
      }),
      LoginAttempt.count({
        where: {
          success: false,
          createdAt: {
            [Op.gte]: last24Hours
          }
        }
      }),
      Session.count({
        where: {
          expiresAt: {
            [Op.gt]: new Date()
          }
        }
      }),
      IpRestriction.count({
        where: { isActive: true }
      })
    ]);

    const statistics: SecurityStatistics = {
      incidents: {
        total: totalIncidents,
        open: openIncidents,
        critical: criticalIncidents
      },
      authentication: {
        recentFailedLogins,
        activeSessions
      },
      ipRestrictions: activeIpRestrictions
    };

    logger.info('Retrieved security statistics');
    return statistics;
  } catch (error) {
    logger.error('Error getting security statistics:', error);
    throw error;
  }
}

/**
 * System Initialization
 */

/**
 * Initialize default roles and permissions for the platform
 * This should be run once during system setup
 */
export async function initializeDefaultRoles(): Promise<void> {
  const transaction = await sequelize.transaction();

  try {
    // Check if roles already exist
    const existingRolesCount = await Role.count({ transaction });
    if (existingRolesCount > 0) {
      logger.info('Roles already initialized');
      await transaction.rollback();
      return;
    }

    // Create default permissions
    const permissionsData = [
      // Student permissions
      { resource: 'students', action: 'read', description: 'View students' },
      { resource: 'students', action: 'create', description: 'Create students' },
      { resource: 'students', action: 'update', description: 'Update students' },
      { resource: 'students', action: 'delete', description: 'Delete students' },

      // Medication permissions
      { resource: 'medications', action: 'read', description: 'View medications' },
      { resource: 'medications', action: 'administer', description: 'Administer medications' },
      { resource: 'medications', action: 'manage', description: 'Manage medication inventory' },

      // Health records permissions
      { resource: 'health_records', action: 'read', description: 'View health records' },
      { resource: 'health_records', action: 'create', description: 'Create health records' },
      { resource: 'health_records', action: 'update', description: 'Update health records' },

      // Reports permissions
      { resource: 'reports', action: 'read', description: 'View reports' },
      { resource: 'reports', action: 'create', description: 'Create reports' },

      // Admin permissions
      { resource: 'users', action: 'manage', description: 'Manage users' },
      { resource: 'system', action: 'configure', description: 'Configure system' },
      { resource: 'security', action: 'manage', description: 'Manage security settings' }
    ];

    const permissions: Permission[] = [];
    for (const permData of permissionsData) {
      const permission = await Permission.create(permData, { transaction });
      permissions.push(permission);
    }

    // Create default roles
    const nurseRole = await Role.create(
      {
        name: 'Nurse',
        description: 'School nurse with full access to student health management',
        isSystem: true
      },
      { transaction }
    );

    const adminRole = await Role.create(
      {
        name: 'Administrator',
        description: 'System administrator with full access',
        isSystem: true
      },
      { transaction }
    );

    // Assign permissions to nurse role
    const nursePermissions = permissions.filter(p =>
      ['students', 'medications', 'health_records', 'reports'].includes(p.resource)
    );

    for (const permission of nursePermissions) {
      await RolePermission.create(
        {
          roleId: nurseRole.id,
          permissionId: permission.id
        },
        { transaction }
      );
    }

    // Assign all permissions to admin role
    for (const permission of permissions) {
      await RolePermission.create(
        {
          roleId: adminRole.id,
          permissionId: permission.id
        },
        { transaction }
      );
    }

    await transaction.commit();
    logger.info('Initialized default roles and permissions successfully');
  } catch (error) {
    await transaction.rollback();
    logger.error('Error initializing default roles:', error);
    throw error;
  }
}
