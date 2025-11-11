/**
 * Administration API - Unified Interface
 * 
 * This module provides a unified interface for all administration and system management
 * operations. It serves as the main entry point for the refactored AdministrationService.ts
 * functionality, organized into focused, specialized services.
 * 
 * Features:
 * - User management (CRUD, roles, authentication)
 * - Organization management (districts, schools)
 * - System configuration management
 * - System monitoring and health checks
 * - Training and compliance management
 * - Performance metrics and backup operations
 * 
 * @module services/modules/administrationApi
 */

import type { ApiClient } from '../../core/ApiClient';

// Export all types
export * from './types';

// Export all validation schemas
export * from './validation';

// Import all services
import { UserManagementService } from './users';
import {
  DistrictsService,
  SchoolsService,
  OrganizationsService,
} from './organizations';
import { ConfigurationService } from './configuration';
import {
  SystemHealthService,
  MetricsService,
  BackupService,
  MonitoringService,
} from './monitoring';
import {
  TrainingModulesService,
  TrainingCompletionService,
  TrainingService,
} from './training';

// Re-export all services
export {
  UserManagementService,
  createUserManagementService,
} from './users';

export {
  DistrictsService,
  SchoolsService,
  OrganizationsService,
  createDistrictsService,
  createSchoolsService,
  createOrganizationsService,
} from './organizations';

export {
  ConfigurationService,
  createConfigurationService,
} from './configuration';

export {
  SystemHealthService,
  MetricsService,
  BackupService,
  MonitoringService,
  createSystemHealthService,
  createMetricsService,
  createBackupService,
  createMonitoringService,
} from './monitoring';

export {
  TrainingModulesService,
  TrainingCompletionService,
  TrainingService,
  createTrainingModulesService,
  createTrainingCompletionService,
  createTrainingService,
} from './training';

// ==========================================
// MAIN ADMINISTRATION SERVICE
// ==========================================

/**
 * Comprehensive Administration Service
 * 
 * This is the main service that combines all specialized administration services
 * into a single, cohesive interface. It replaces the large monolithic
 * AdministrationService.ts with a modular, maintainable structure.
 */
export class AdministrationApiService {
  // User Management
  public readonly users: UserManagementService;
  
  // Organization Management
  public readonly organizations: OrganizationsService;
  public readonly districts: DistrictsService;
  public readonly schools: SchoolsService;
  
  // System Configuration
  public readonly configuration: ConfigurationService;
  
  // System Monitoring
  public readonly monitoring: MonitoringService;
  public readonly health: SystemHealthService;
  public readonly metrics: MetricsService;
  public readonly backups: BackupService;
  
  // Training Management
  public readonly training: TrainingService;
  public readonly trainingModules: TrainingModulesService;
  public readonly trainingCompletions: TrainingCompletionService;

  constructor(private readonly client: ApiClient) {
    // Initialize all services with the API client
    this.users = new UserManagementService(client);
    
    this.organizations = new OrganizationsService(client);
    this.districts = new DistrictsService(client);
    this.schools = new SchoolsService(client);
    
    this.configuration = new ConfigurationService(client);
    
    this.monitoring = new MonitoringService(client);
    this.health = new SystemHealthService(client);
    this.metrics = new MetricsService(client);
    this.backups = new BackupService(client);
    
    this.training = new TrainingService(client);
    this.trainingModules = new TrainingModulesService(client);
    this.trainingCompletions = new TrainingCompletionService(client);
  }

  /**
   * Get comprehensive administration dashboard data
   */
  async getAdministrationDashboard(): Promise<{
    system: {
      health: import('./types').SystemHealth;
      uptime: number;
      version: string;
    };
    users: {
      total: number;
      active: number;
      recentLogins: number;
      newThisWeek: number;
    };
    organizations: {
      totalDistricts: number;
      totalSchools: number;
      totalEnrollment: number;
    };
    training: {
      totalModules: number;
      completionRate: number;
      overdueUsers: number;
    };
    metrics: {
      averageResponseTime: number;
      errorRate: number;
      throughput: number;
    };
    recentActivity: Array<{
      type: 'user' | 'organization' | 'training' | 'system';
      action: string;
      timestamp: string;
      details: Record<string, unknown>;
    }>;
  }> {
    try {
      // Gather data from all services in parallel
      const [
        systemHealth,
        userStats,
        orgStats,
        trainingDashboard,
        metricsStatus
      ] = await Promise.allSettled([
        this.health.getSystemHealth(),
        this.users.getUserStatistics(),
        this.organizations.getOrganizationStatistics(),
        this.training.getTrainingDashboard(),
        this.metrics.getMetricsSummary()
      ]);

      // Extract successful results with fallbacks for errors
      const health = systemHealth.status === 'fulfilled' ? systemHealth.value : {
        status: 'down' as const,
        uptime: 0,
        version: 'unknown',
        environment: 'development' as const,
        services: [],
        metrics: {
          cpu: 0,
          memory: 0,
          disk: 0,
          database: { connections: 0, responseTime: 0 },
          cache: { hitRate: 0, size: 0 }
        },
        lastCheck: new Date().toISOString()
      };

      const users = userStats.status === 'fulfilled' ? userStats.value : {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        usersByRole: {},
        recentLogins: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0
      };

      const orgs = orgStats.status === 'fulfilled' ? orgStats.value : {
        totalDistricts: 0,
        activeDistricts: 0,
        totalSchools: 0,
        activeSchools: 0,
        totalUsers: 0,
        activeUsers: 0,
        totalEnrollment: 0,
        schoolsByType: {},
        usersByRole: {}
      };

      const training = trainingDashboard.status === 'fulfilled' ? trainingDashboard.value : {
        totalModules: 0,
        activeModules: 0,
        requiredModules: 0,
        totalCompletions: 0,
        recentCompletions: [],
        overdueUsers: 0,
        averageScore: 0,
        completionRate: 0,
        modulesByCategory: []
      };

      const metrics = metricsStatus.status === 'fulfilled' ? metricsStatus.value : {
        totalMetrics: 0,
        averageResponseTime: 0,
        errorRate: 0,
        throughput: 0,
        topMetrics: []
      };

      // Generate recent activity summary (simplified)
      const recentActivity: Array<{
        type: 'user' | 'organization' | 'training' | 'system';
        action: string;
        timestamp: string;
        details: Record<string, unknown>;
      }> = [
        {
          type: 'system',
          action: 'Health Check',
          timestamp: health.lastCheck,
          details: { status: health.status }
        }
      ];

      // Add training activity if available
      if (training.recentCompletions.length > 0) {
        training.recentCompletions.slice(0, 3).forEach(completion => {
          recentActivity.push({
            type: 'training',
            action: 'Training Completed',
            timestamp: completion.completedAt,
            details: {
              userId: completion.userId,
              moduleId: completion.moduleId,
              score: completion.score
            }
          });
        });
      }

      return {
        system: {
          health,
          uptime: health.uptime,
          version: health.version
        },
        users: {
          total: users.totalUsers,
          active: users.activeUsers,
          recentLogins: users.recentLogins,
          newThisWeek: users.newUsersThisWeek
        },
        organizations: {
          totalDistricts: orgs.totalDistricts,
          totalSchools: orgs.totalSchools,
          totalEnrollment: orgs.totalEnrollment
        },
        training: {
          totalModules: training.totalModules,
          completionRate: training.completionRate,
          overdueUsers: training.overdueUsers
        },
        metrics: {
          averageResponseTime: metrics.averageResponseTime,
          errorRate: metrics.errorRate,
          throughput: metrics.throughput
        },
        recentActivity: recentActivity.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 10)
      };
    } catch (error) {
      throw new Error(`Failed to fetch administration dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform comprehensive system check
   */
  async performSystemCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'down';
    timestamp: string;
    checks: Array<{
      category: string;
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message: string;
      details?: Record<string, unknown>;
    }>;
    recommendations: string[];
  }> {
    try {
      const timestamp = new Date().toISOString();
      const checks: Array<{
        category: string;
        name: string;
        status: 'pass' | 'warn' | 'fail';
        message: string;
        details?: Record<string, unknown>;
      }> = [];

      // System health check
      try {
        const health = await this.health.getSystemHealth();
        checks.push({
          category: 'System',
          name: 'Health Status',
          status: health.status === 'healthy' ? 'pass' : health.status === 'degraded' ? 'warn' : 'fail',
          message: `System is ${health.status}`,
          details: {
            uptime: health.uptime,
            version: health.version,
            environment: health.environment
          }
        });

        // Check individual services
        health.services.forEach(service => {
          checks.push({
            category: 'Services',
            name: service.name,
            status: service.status === 'healthy' ? 'pass' : service.status === 'degraded' ? 'warn' : 'fail',
            message: `${service.name} is ${service.status}`,
            details: {
              responseTime: service.responseTime,
              lastCheck: service.lastCheck,
              error: service.error
            }
          });
        });
      } catch (error) {
        checks.push({
          category: 'System',
          name: 'Health Check',
          status: 'fail',
          message: 'Failed to check system health',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }

      // Database and metrics check
      try {
        const metrics = await this.metrics.getMetricsSummary();
        checks.push({
          category: 'Performance',
          name: 'Metrics Collection',
          status: 'pass',
          message: `Collected ${metrics.totalMetrics} metrics`,
          details: {
            averageResponseTime: metrics.averageResponseTime,
            errorRate: metrics.errorRate,
            throughput: metrics.throughput
          }
        });
      } catch (error) {
        checks.push({
          category: 'Performance',
          name: 'Metrics Collection',
          status: 'warn',
          message: 'Unable to collect metrics',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }

      // Backup status check
      try {
        const backupStats = await this.backups.getBackupStatistics();
        const lastBackupAge = backupStats.lastBackup ? 
          Date.now() - new Date(backupStats.lastBackup.createdAt).getTime() : 
          Infinity;

        const daysSinceLastBackup = lastBackupAge / (1000 * 60 * 60 * 24);

        checks.push({
          category: 'Backup',
          name: 'Backup Status',
          status: daysSinceLastBackup <= 1 ? 'pass' : daysSinceLastBackup <= 7 ? 'warn' : 'fail',
          message: `Last backup: ${daysSinceLastBackup.toFixed(1)} days ago`,
          details: {
            totalBackups: backupStats.totalBackups,
            successfulBackups: backupStats.successfulBackups,
            failedBackups: backupStats.failedBackups
          }
        });
      } catch (error) {
        checks.push({
          category: 'Backup',
          name: 'Backup Status',
          status: 'warn',
          message: 'Unable to check backup status',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }

      // Determine overall status
      const hasFailures = checks.some(check => check.status === 'fail');
      const hasWarnings = checks.some(check => check.status === 'warn');
      const overall = hasFailures ? 'down' : hasWarnings ? 'degraded' : 'healthy';

      // Generate recommendations
      const recommendations: string[] = [];
      
      if (hasFailures) {
        recommendations.push('Immediate attention required: Critical system failures detected');
      }
      
      const failedServices = checks.filter(check => 
        check.category === 'Services' && check.status === 'fail'
      );
      if (failedServices.length > 0) {
        recommendations.push(`Restart failed services: ${failedServices.map(s => s.name).join(', ')}`);
      }

      const backupCheck = checks.find(check => check.name === 'Backup Status');
      if (backupCheck && backupCheck.status !== 'pass') {
        recommendations.push('Schedule and verify system backups');
      }

      const metricsCheck = checks.find(check => check.name === 'Metrics Collection');
      if (metricsCheck && metricsCheck.status !== 'pass') {
        recommendations.push('Check metrics collection and database connectivity');
      }

      if (overall === 'healthy') {
        recommendations.push('System is operating normally');
      }

      return {
        overall,
        timestamp,
        checks,
        recommendations
      };
    } catch (error) {
      return {
        overall: 'down',
        timestamp: new Date().toISOString(),
        checks: [{
          category: 'System',
          name: 'System Check',
          status: 'fail',
          message: 'Failed to perform system check',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }],
        recommendations: ['Unable to perform system check - investigate system connectivity']
      };
    }
  }

  /**
   * Get system information and statistics
   */
  async getSystemInfo(): Promise<{
    version: string;
    environment: string;
    uptime: number;
    users: {
      total: number;
      active: number;
      byRole: Record<string, number>;
    };
    organizations: {
      districts: number;
      schools: number;
      enrollment: number;
    };
    training: {
      modules: number;
      completions: number;
      complianceRate: number;
    };
    performance: {
      responseTime: number;
      errorRate: number;
      throughput: number;
    };
    storage: {
      backups: number;
      totalSize: number;
      lastBackup?: string;
    };
  }> {
    try {
      const [healthData, userStats, orgStats, trainingStats, metricsData, backupStats] = await Promise.allSettled([
        this.health.getSystemHealth(),
        this.users.getUserStatistics(),
        this.organizations.getOrganizationStatistics(),
        this.training.getTrainingDashboard(),
        this.metrics.getMetricsSummary(),
        this.backups.getBackupStatistics()
      ]);

      // Extract data with fallbacks
      const health = healthData.status === 'fulfilled' ? healthData.value : null;
      const users = userStats.status === 'fulfilled' ? userStats.value : null;
      const orgs = orgStats.status === 'fulfilled' ? orgStats.value : null;
      const training = trainingStats.status === 'fulfilled' ? trainingStats.value : null;
      const metrics = metricsData.status === 'fulfilled' ? metricsData.value : null;
      const backups = backupStats.status === 'fulfilled' ? backupStats.value : null;

      return {
        version: health?.version || 'unknown',
        environment: health?.environment || 'unknown',
        uptime: health?.uptime || 0,
        users: {
          total: users?.totalUsers || 0,
          active: users?.activeUsers || 0,
          byRole: users?.usersByRole || {}
        },
        organizations: {
          districts: orgs?.totalDistricts || 0,
          schools: orgs?.totalSchools || 0,
          enrollment: orgs?.totalEnrollment || 0
        },
        training: {
          modules: training?.totalModules || 0,
          completions: training?.totalCompletions || 0,
          complianceRate: training?.completionRate || 0
        },
        performance: {
          responseTime: metrics?.averageResponseTime || 0,
          errorRate: metrics?.errorRate || 0,
          throughput: metrics?.throughput || 0
        },
        storage: {
          backups: backups?.totalBackups || 0,
          totalSize: backups?.totalSize || 0,
          lastBackup: backups?.lastBackup?.createdAt
        }
      };
    } catch (error) {
      throw new Error(`Failed to get system information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

/**
 * Create a new instance of the Administration API Service
 */
export function createAdministrationApiService(client: ApiClient): AdministrationApiService {
  return new AdministrationApiService(client);
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * Default export for backward compatibility
 */
export default AdministrationApiService;

// ==========================================
// TYPE GUARDS AND UTILITIES
// ==========================================

/**
 * Type guard to check if a service is available
 */
export function isServiceAvailable<T>(
  serviceResult: PromiseSettledResult<T>
): serviceResult is PromiseFulfilledResult<T> {
  return serviceResult.status === 'fulfilled';
}

/**
 * Helper to extract error from failed service calls
 */
export function extractServiceError(
  serviceResult: PromiseSettledResult<unknown>
): string {
  return serviceResult.status === 'rejected' 
    ? (serviceResult.reason instanceof Error ? serviceResult.reason.message : 'Unknown error')
    : 'No error';
}

/**
 * Utility to safely call a service method with fallback
 */
export async function safeServiceCall<T>(
  serviceCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await serviceCall();
  } catch (error) {
    console.warn('Service call failed, using fallback:', error);
    return fallback;
  }
}
