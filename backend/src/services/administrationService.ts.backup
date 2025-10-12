import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import {
  District,
  School,
  SystemConfiguration,
  ConfigurationHistory,
  BackupLog,
  PerformanceMetric,
  License,
  TrainingModule,
  TrainingCompletion,
  User,
  AuditLog,
  sequelize
} from '../database/models';
import {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
  BackupType,
  BackupStatus,
  MetricType,
  LicenseType,
  LicenseStatus,
  TrainingCategory,
  AuditAction
} from '../database/types/enums';

// ==================== TYPE DEFINITIONS ====================

export interface CreateDistrictData {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

export interface UpdateDistrictData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface CreateSchoolData {
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
}

export interface UpdateSchoolData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive?: boolean;
}

export interface ConfigurationData {
  key: string;
  value: string;
  category: ConfigCategory;
  valueType?: ConfigValueType;
  subCategory?: string;
  description?: string;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

export interface BackupData {
  type: BackupType;
  triggeredBy?: string;
}

export interface CreateLicenseData {
  licenseKey: string;
  type: LicenseType;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: Date;
  districtId?: string;
  notes?: string;
}

export interface CreateTrainingModuleData {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  districtId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * AdministrationService
 *
 * Manages system administration, district/school operations, licensing,
 * configuration management, backup operations, and training modules.
 *
 * Key Features:
 * - District and school management with hierarchical structure
 * - System configuration with change history tracking
 * - License management and feature control
 * - Backup operations and monitoring
 * - Performance metrics collection
 * - Training module management and completion tracking
 * - System health monitoring
 */
export class AdministrationService {
  // ==================== SYSTEM SETTINGS MANAGEMENT ====================

  /**
   * Get all system settings grouped by category
   */
  static async getSystemSettings() {
    try {
      const configs = await this.getAllConfigurations();

      // Group configurations by category for easier consumption
      const groupedSettings: Record<string, any[]> = {};
      configs.forEach(config => {
        if (!groupedSettings[config.category]) {
          groupedSettings[config.category] = [];
        }
        groupedSettings[config.category].push({
          key: config.key,
          value: config.value,
          valueType: config.valueType,
          description: config.description,
          isPublic: config.isPublic,
          isEditable: config.isEditable,
          requiresRestart: config.requiresRestart,
          category: config.category,
          subCategory: config.subCategory,
          scope: config.scope,
          tags: config.tags
        });
      });

      return groupedSettings;
    } catch (error) {
      logger.error('Error fetching system settings:', error);
      throw new Error('Failed to fetch system settings');
    }
  }

  /**
   * Update multiple system settings
   */
  static async updateSystemSettings(settings: ConfigurationData[], changedBy?: string) {
    try {
      const results = await Promise.all(
        settings.map(setting => this.setConfiguration(setting, changedBy))
      );

      logger.info(`Updated ${results.length} system settings`);
      return results;
    } catch (error) {
      logger.error('Error updating system settings:', error);
      throw error;
    }
  }

  // ==================== DISTRICT MANAGEMENT ====================

  /**
   * Create a new district
   */
  static async createDistrict(data: CreateDistrictData) {
    try {
      // Normalize and validate district code
      const normalizedCode = data.code.toUpperCase().trim();

      // Check for duplicate district code
      const existingDistrict = await District.findOne({
        where: { code: normalizedCode }
      });

      if (existingDistrict) {
        throw new Error(`District with code '${normalizedCode}' already exists`);
      }

      // Validate email format if provided
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Invalid email address format');
      }

      // Validate phone format if provided
      if (data.phone && !/^[\d\s\-\(\)\+\.]+$/.test(data.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Validate ZIP code format if provided
      if (data.zipCode && !/^[0-9]{5}(-[0-9]{4})?$/.test(data.zipCode)) {
        throw new Error('ZIP code must be in format 12345 or 12345-6789');
      }

      // Validate state format if provided
      if (data.state && (data.state.length !== 2 || data.state !== data.state.toUpperCase())) {
        throw new Error('State must be a 2-letter uppercase abbreviation');
      }

      const district = await District.create({
        ...data,
        code: normalizedCode
      });

      // Create audit log
      await this.createAuditLog(
        AuditAction.CREATE,
        'District',
        district.id,
        undefined,
        { name: district.name, code: district.code }
      );

      logger.info(`District created: ${district.name} (${district.code})`);
      return district;
    } catch (error) {
      logger.error('Error creating district:', error);
      throw error;
    }
  }

  /**
   * Get districts with pagination
   */
  static async getDistricts(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: districts, count: total } = await District.findAndCountAll({
        offset,
        limit,
        include: [
          {
            model: School,
            as: 'schools',
            attributes: ['id', 'name', 'code', 'isActive']
          }
        ],
        order: [['name', 'ASC']],
        distinct: true
      });

      return {
        districts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts');
    }
  }

  /**
   * Get district by ID with associated data
   */
  static async getDistrictById(id: string) {
    try {
      const district = await District.findByPk(id, {
        include: [
          {
            model: School,
            as: 'schools',
            where: { isActive: true },
            required: false
          },
          {
            model: License,
            as: 'licenses',
            where: { status: LicenseStatus.ACTIVE },
            required: false,
            order: [['expiresAt', 'DESC']]
          }
        ]
      });

      if (!district) {
        throw new Error('District not found');
      }

      return district;
    } catch (error) {
      logger.error('Error fetching district:', error);
      throw error;
    }
  }

  /**
   * Update district information
   */
  static async updateDistrict(id: string, data: UpdateDistrictData) {
    try {
      const district = await District.findByPk(id);

      if (!district) {
        throw new Error('District not found');
      }

      // Validate email format if provided
      if (data.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Invalid email address format');
      }

      // Validate phone format if provided
      if (data.phone && !/^[\d\s\-\(\)\+\.]+$/.test(data.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Validate ZIP code format if provided
      if (data.zipCode && !/^[0-9]{5}(-[0-9]{4})?$/.test(data.zipCode)) {
        throw new Error('ZIP code must be in format 12345 or 12345-6789');
      }

      // Validate state format if provided
      if (data.state && (data.state.length !== 2 || data.state !== data.state.toUpperCase())) {
        throw new Error('State must be a 2-letter uppercase abbreviation');
      }

      // Store old values for audit
      const oldValues = {
        name: district.name,
        address: district.address,
        city: district.city,
        state: district.state,
        zipCode: district.zipCode,
        phone: district.phone,
        email: district.email,
        isActive: district.isActive
      };

      await district.update(data);

      // Create audit log
      await this.createAuditLog(
        AuditAction.UPDATE,
        'District',
        district.id,
        undefined,
        { old: oldValues, new: data }
      );

      logger.info(`District updated: ${district.name} (${id})`);
      return district;
    } catch (error) {
      logger.error('Error updating district:', error);
      throw error;
    }
  }

  /**
   * Delete district (soft delete by setting isActive to false)
   */
  static async deleteDistrict(id: string) {
    const transaction = await sequelize.transaction();

    try {
      const district = await District.findByPk(id, { transaction });

      if (!district) {
        throw new Error('District not found');
      }

      // Check for active schools under this district
      const activeSchoolCount = await School.count({
        where: {
          districtId: id,
          isActive: true
        },
        transaction
      });

      if (activeSchoolCount > 0) {
        throw new Error(`Cannot delete district with ${activeSchoolCount} active school(s). Please deactivate schools first.`);
      }

      // Check for active licenses
      const activeLicenseCount = await License.count({
        where: {
          districtId: id,
          status: LicenseStatus.ACTIVE
        },
        transaction
      });

      if (activeLicenseCount > 0) {
        throw new Error(`Cannot delete district with ${activeLicenseCount} active license(s). Please deactivate licenses first.`);
      }

      // Soft delete
      await district.update({ isActive: false }, { transaction });

      // Create audit log
      await this.createAuditLog(
        AuditAction.DELETE,
        'District',
        district.id,
        undefined,
        { name: district.name, deactivated: true }
      );

      await transaction.commit();

      logger.info(`District deactivated: ${district.name} (${id})`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting district:', error);
      throw error;
    }
  }

  // ==================== SCHOOL MANAGEMENT ====================

  /**
   * Create a new school
   */
  static async createSchool(data: CreateSchoolData) {
    try {
      // Verify district exists and is active
      const district = await District.findByPk(data.districtId);

      if (!district) {
        throw new Error('District not found');
      }

      if (!district.isActive) {
        throw new Error('Cannot create school under an inactive district');
      }

      // Normalize and validate school code
      const normalizedCode = data.code.toUpperCase().trim();

      // Check for duplicate school code
      const existingSchool = await School.findOne({
        where: { code: normalizedCode }
      });

      if (existingSchool) {
        throw new Error(`School with code '${normalizedCode}' already exists`);
      }

      // Validate email format if provided
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Invalid email address format');
      }

      // Validate phone format if provided
      if (data.phone && !/^[\d\s\-\(\)\+\.]+$/.test(data.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Validate ZIP code format if provided
      if (data.zipCode && !/^[0-9]{5}(-[0-9]{4})?$/.test(data.zipCode)) {
        throw new Error('ZIP code must be in format 12345 or 12345-6789');
      }

      // Validate state format if provided
      if (data.state && (data.state.length !== 2 || data.state !== data.state.toUpperCase())) {
        throw new Error('State must be a 2-letter uppercase abbreviation');
      }

      // Validate enrollment if provided
      if (data.totalEnrollment !== undefined) {
        if (data.totalEnrollment < 0) {
          throw new Error('Total enrollment cannot be negative');
        }
        if (data.totalEnrollment > 50000) {
          throw new Error('Total enrollment cannot exceed 50,000');
        }
      }

      const school = await School.create({
        ...data,
        code: normalizedCode
      });

      // Reload with associations
      await school.reload({
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      // Create audit log
      await this.createAuditLog(
        AuditAction.CREATE,
        'School',
        school.id,
        undefined,
        { name: school.name, code: school.code, districtId: school.districtId }
      );

      logger.info(`School created: ${school.name} (${school.code})`);
      return school;
    } catch (error) {
      logger.error('Error creating school:', error);
      throw error;
    }
  }

  /**
   * Get schools with pagination and optional district filter
   */
  static async getSchools(page: number = 1, limit: number = 20, districtId?: string) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (districtId) {
        whereClause.districtId = districtId;
      }

      const { rows: schools, count: total } = await School.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['name', 'ASC']],
        distinct: true
      });

      return {
        schools,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching schools:', error);
      throw new Error('Failed to fetch schools');
    }
  }

  /**
   * Get school by ID with associated data
   */
  static async getSchoolById(id: string) {
    try {
      const school = await School.findByPk(id, {
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      if (!school) {
        throw new Error('School not found');
      }

      return school;
    } catch (error) {
      logger.error('Error fetching school:', error);
      throw error;
    }
  }

  /**
   * Update school information
   */
  static async updateSchool(id: string, data: UpdateSchoolData) {
    try {
      const school = await School.findByPk(id, {
        include: [
          {
            model: District,
            as: 'district'
          }
        ]
      });

      if (!school) {
        throw new Error('School not found');
      }

      await school.update(data);

      // Reload with associations
      await school.reload({
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      logger.info(`School updated: ${school.name} (${id})`);
      return school;
    } catch (error) {
      logger.error('Error updating school:', error);
      throw error;
    }
  }

  /**
   * Delete school (soft delete by setting isActive to false)
   */
  static async deleteSchool(id: string) {
    try {
      const school = await School.findByPk(id);

      if (!school) {
        throw new Error('School not found');
      }

      // Soft delete
      await school.update({ isActive: false });

      logger.info(`School deactivated: ${school.name} (${id})`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting school:', error);
      throw error;
    }
  }

  // ==================== SYSTEM CONFIGURATION ====================

  /**
   * Get a single configuration by key
   */
  static async getConfiguration(key: string) {
    try {
      const config = await SystemConfiguration.findOne({
        where: { key }
      });

      return config;
    } catch (error) {
      logger.error('Error fetching configuration:', error);
      throw error;
    }
  }

  /**
   * Get all configurations, optionally filtered by category
   */
  static async getAllConfigurations(category?: ConfigCategory) {
    try {
      const whereClause: any = {};

      if (category) {
        whereClause.category = category;
      }

      const configs = await SystemConfiguration.findAll({
        where: whereClause,
        order: [
          ['category', 'ASC'],
          ['sortOrder', 'ASC'],
          ['key', 'ASC']
        ]
      });

      return configs;
    } catch (error) {
      logger.error('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Set configuration with change history tracking
   */
  static async setConfiguration(data: ConfigurationData, changedBy?: string) {
    const transaction = await sequelize.transaction();

    try {
      // Find existing configuration
      const existingConfig = await SystemConfiguration.findOne({
        where: { key: data.key },
        transaction
      });

      let config: SystemConfiguration;
      const oldValue = existingConfig?.value;

      if (existingConfig) {
        // Update existing configuration
        await existingConfig.update(
          {
            value: data.value,
            category: data.category,
            valueType: data.valueType,
            subCategory: data.subCategory,
            description: data.description,
            isPublic: data.isPublic,
            isEditable: data.isEditable,
            requiresRestart: data.requiresRestart,
            scope: data.scope,
            scopeId: data.scopeId,
            tags: data.tags,
            sortOrder: data.sortOrder
          },
          { transaction }
        );
        config = existingConfig;
      } else {
        // Create new configuration
        config = await SystemConfiguration.create(data, { transaction });
      }

      // Create configuration history record
      if (changedBy) {
        await ConfigurationHistory.create(
          {
            configKey: data.key,
            oldValue,
            newValue: data.value,
            changedBy,
            configurationId: config.id
          },
          { transaction }
        );
      }

      await transaction.commit();

      logger.info(`Configuration set: ${data.key} = ${data.value}`);
      return config;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error setting configuration:', error);
      throw error;
    }
  }

  /**
   * Delete configuration
   */
  static async deleteConfiguration(key: string) {
    try {
      const config = await SystemConfiguration.findOne({
        where: { key }
      });

      if (!config) {
        throw new Error('Configuration not found');
      }

      await config.destroy();

      logger.info(`Configuration deleted: ${key}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting configuration:', error);
      throw error;
    }
  }

  /**
   * Get configuration change history
   */
  static async getConfigurationHistory(configKey: string, limit: number = 50) {
    try {
      const history = await ConfigurationHistory.findAll({
        where: { configKey },
        limit,
        order: [['createdAt', 'DESC']]
      });

      return history;
    } catch (error) {
      logger.error('Error fetching configuration history:', error);
      throw error;
    }
  }

  // ==================== BACKUP & RECOVERY ====================

  /**
   * Create a backup log entry and initiate backup process
   */
  static async createBackup(data: BackupData) {
    try {
      const backup = await BackupLog.create({
        type: data.type,
        status: BackupStatus.IN_PROGRESS,
        startedAt: new Date(),
        triggeredBy: data.triggeredBy
      });

      logger.info(`Backup started: ${backup.id} (${backup.type})`);

      // In a real implementation, this would trigger the actual backup process
      // For now, simulate completion
      setTimeout(async () => {
        try {
          await backup.update({
            status: BackupStatus.COMPLETED,
            completedAt: new Date(),
            fileName: `backup_${backup.id}_${Date.now()}.sql`,
            fileSize: Math.floor(Math.random() * 1000000000), // Simulated size
            location: '/backups'
          });
          logger.info(`Backup completed: ${backup.id}`);
        } catch (error) {
          logger.error(`Backup failed: ${backup.id}`, error);
          await backup.update({
            status: BackupStatus.FAILED,
            completedAt: new Date(),
            error: (error as Error).message
          });
        }
      }, 1000);

      return backup;
    } catch (error) {
      logger.error('Error creating backup:', error);
      throw error;
    }
  }

  /**
   * Get backup logs with pagination
   */
  static async getBackupLogs(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: backups, count: total } = await BackupLog.findAndCountAll({
        offset,
        limit,
        order: [['startedAt', 'DESC']]
      });

      return {
        backups,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching backup logs:', error);
      throw new Error('Failed to fetch backup logs');
    }
  }

  /**
   * Get backup log by ID
   */
  static async getBackupById(id: string) {
    try {
      const backup = await BackupLog.findByPk(id);

      if (!backup) {
        throw new Error('Backup not found');
      }

      return backup;
    } catch (error) {
      logger.error('Error fetching backup:', error);
      throw error;
    }
  }

  // ==================== PERFORMANCE MONITORING ====================

  /**
   * Record a performance metric
   */
  static async recordMetric(
    metricType: MetricType,
    value: number,
    unit?: string,
    context?: any
  ) {
    try {
      const metric = await PerformanceMetric.create({
        metricType,
        value,
        unit,
        context
      });

      return metric;
    } catch (error) {
      logger.error('Error recording metric:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics with filtering
   */
  static async getMetrics(
    metricType?: MetricType,
    startDate?: Date,
    endDate?: Date,
    limit: number = 1000
  ) {
    try {
      const whereClause: any = {};

      if (metricType) {
        whereClause.metricType = metricType;
      }

      if (startDate || endDate) {
        whereClause.recordedAt = {};
        if (startDate) {
          whereClause.recordedAt[Op.gte] = startDate;
        }
        if (endDate) {
          whereClause.recordedAt[Op.lte] = endDate;
        }
      }

      const metrics = await PerformanceMetric.findAll({
        where: whereClause,
        limit,
        order: [['recordedAt', 'DESC']]
      });

      return metrics;
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      throw error;
    }
  }

  /**
   * Get system health metrics
   */
  static async getSystemHealth() {
    try {
      const os = require('os');
      const process = require('process');

      // Get real system metrics
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      // CPU usage calculation
      const cpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;

      cpus.forEach((cpu: any) => {
        for (const type in cpu.times) {
          totalTick += cpu.times[type as keyof typeof cpu.times];
        }
        totalIdle += cpu.times.idle;
      });

      const cpuUsagePercent = 100 - (100 * totalIdle / totalTick);

      // Process memory usage
      const processMemory = process.memoryUsage();
      const heapUsedMB = processMemory.heapUsed / 1024 / 1024;
      const heapTotalMB = processMemory.heapTotal / 1024 / 1024;

      // Uptime
      const uptimeSeconds = os.uptime();
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const uptimeString = `${days}d ${hours}h`;

      // Database connection check
      let databaseStatus = 'Online';
      try {
        await sequelize.authenticate();
      } catch (error) {
        databaseStatus = 'Error';
        logger.error('Database connection check failed:', error);
      }

      // Get system statistics
      const [userCount, activeUserCount, districtCount, schoolCount] = await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        District.count(),
        School.count()
      ]);

      // Get recent performance metrics from database
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // Last hour

      const dbMetrics = await PerformanceMetric.findAll({
        where: {
          recordedAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        order: [['recordedAt', 'DESC']],
        limit: 100
      });

      // Calculate averages for stored metrics
      const metricsByType: Record<string, number[]> = {};
      dbMetrics.forEach((metric) => {
        if (!metricsByType[metric.metricType]) {
          metricsByType[metric.metricType] = [];
        }
        metricsByType[metric.metricType].push(metric.value);
      });

      const dbAverages: Record<string, number> = {};
      Object.keys(metricsByType).forEach(type => {
        const values = metricsByType[type];
        dbAverages[type] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      });

      // Store current metrics
      await Promise.allSettled([
        this.recordMetric(MetricType.CPU_USAGE, parseFloat(cpuUsagePercent.toFixed(2)), '%'),
        this.recordMetric(MetricType.MEMORY_USAGE, parseFloat(memoryUsagePercent.toFixed(2)), '%'),
        this.recordMetric(MetricType.ACTIVE_USERS, activeUserCount, 'count')
      ]);

      return {
        status: 'healthy',
        timestamp: new Date(),
        metrics: {
          cpu: parseFloat(cpuUsagePercent.toFixed(2)),
          memory: parseFloat(memoryUsagePercent.toFixed(2)),
          disk: dbAverages[MetricType.DISK_USAGE] || 0,
          database: databaseStatus,
          apiResponseTime: dbAverages[MetricType.API_RESPONSE_TIME] || 0,
          uptime: uptimeString,
          connections: activeUserCount,
          errorRate: dbAverages[MetricType.ERROR_RATE] || 0,
          queuedJobs: 0, // Would integrate with job queue if implemented
          cacheHitRate: 94 // Would integrate with Redis if implemented
        },
        statistics: {
          totalUsers: userCount,
          activeUsers: activeUserCount,
          totalDistricts: districtCount,
          totalSchools: schoolCount
        },
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          totalMemoryGB: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
          freeMemoryGB: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
          cpuCount: cpus.length,
          cpuModel: cpus[0]?.model || 'Unknown',
          processHeapUsedMB: heapUsedMB.toFixed(2),
          processHeapTotalMB: heapTotalMB.toFixed(2)
        }
      };
    } catch (error) {
      logger.error('Error fetching system health:', error);
      throw error;
    }
  }

  // ==================== LICENSE MANAGEMENT ====================

  /**
   * Create a new license
   */
  static async createLicense(data: CreateLicenseData) {
    try {
      // Verify district exists and is active if districtId is provided
      if (data.districtId) {
        const district = await District.findByPk(data.districtId);
        if (!district) {
          throw new Error('District not found');
        }
        if (!district.isActive) {
          throw new Error('Cannot create license for an inactive district');
        }
      }

      // Validate license key format
      const normalizedKey = data.licenseKey.toUpperCase().trim();
      if (!/^[A-Z0-9-]+$/.test(normalizedKey)) {
        throw new Error('License key can only contain uppercase letters, numbers, and hyphens');
      }

      // Check for duplicate license key
      const existingLicense = await License.findOne({
        where: { licenseKey: normalizedKey }
      });

      if (existingLicense) {
        throw new Error(`License with key '${normalizedKey}' already exists`);
      }

      // Validate license type limits
      switch (data.type) {
        case LicenseType.TRIAL:
          if (!data.maxUsers || data.maxUsers > 10) {
            throw new Error('Trial license cannot have more than 10 users');
          }
          if (!data.maxSchools || data.maxSchools > 2) {
            throw new Error('Trial license cannot have more than 2 schools');
          }
          if (!data.expiresAt) {
            throw new Error('Trial license must have an expiration date');
          }
          break;
        case LicenseType.BASIC:
          if (data.maxUsers && data.maxUsers > 50) {
            throw new Error('Basic license cannot have more than 50 users');
          }
          if (data.maxSchools && data.maxSchools > 5) {
            throw new Error('Basic license cannot have more than 5 schools');
          }
          break;
        case LicenseType.PROFESSIONAL:
          if (data.maxUsers && data.maxUsers > 500) {
            throw new Error('Professional license cannot have more than 500 users');
          }
          if (data.maxSchools && data.maxSchools > 50) {
            throw new Error('Professional license cannot have more than 50 schools');
          }
          break;
      }

      // Validate features array
      if (!data.features || data.features.length === 0) {
        throw new Error('At least one feature must be specified for the license');
      }

      // Validate expiration date
      if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        if (expirationDate < new Date()) {
          throw new Error('Expiration date must be in the future');
        }
      }

      const license = await License.create({
        ...data,
        licenseKey: normalizedKey,
        status: LicenseStatus.ACTIVE,
        issuedAt: new Date(),
        activatedAt: new Date()
      });

      // Reload with associations
      if (data.districtId) {
        await license.reload({
          include: [
            {
              model: District,
              as: 'district',
              attributes: ['id', 'name', 'code']
            }
          ]
        });
      }

      // Create audit log
      await this.createAuditLog(
        AuditAction.CREATE,
        'License',
        license.id,
        undefined,
        { licenseKey: license.licenseKey, type: license.type, districtId: license.districtId }
      );

      logger.info(`License created: ${license.licenseKey} (${license.type})`);
      return license;
    } catch (error) {
      logger.error('Error creating license:', error);
      throw error;
    }
  }

  /**
   * Get licenses with pagination
   */
  static async getLicenses(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: licenses, count: total } = await License.findAndCountAll({
        offset,
        limit,
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        licenses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching licenses:', error);
      throw new Error('Failed to fetch licenses');
    }
  }

  /**
   * Get license by ID
   */
  static async getLicenseById(id: string) {
    try {
      const license = await License.findByPk(id, {
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      if (!license) {
        throw new Error('License not found');
      }

      return license;
    } catch (error) {
      logger.error('Error fetching license:', error);
      throw error;
    }
  }

  /**
   * Update license
   */
  static async updateLicense(
    id: string,
    data: Partial<CreateLicenseData> & { status?: LicenseStatus }
  ) {
    try {
      const license = await License.findByPk(id);

      if (!license) {
        throw new Error('License not found');
      }

      await license.update(data);

      // Reload with associations
      if (license.districtId) {
        await license.reload({
          include: [
            {
              model: District,
              as: 'district',
              attributes: ['id', 'name', 'code']
            }
          ]
        });
      }

      logger.info(`License updated: ${license.licenseKey} (${id})`);
      return license;
    } catch (error) {
      logger.error('Error updating license:', error);
      throw error;
    }
  }

  /**
   * Deactivate license
   */
  static async deactivateLicense(id: string) {
    try {
      const license = await License.findByPk(id);

      if (!license) {
        throw new Error('License not found');
      }

      await license.update({
        status: LicenseStatus.SUSPENDED,
        deactivatedAt: new Date()
      });

      logger.info(`License deactivated: ${license.licenseKey} (${id})`);
      return license;
    } catch (error) {
      logger.error('Error deactivating license:', error);
      throw error;
    }
  }

  // ==================== TRAINING MODULE MANAGEMENT ====================

  /**
   * Create a training module
   */
  static async createTrainingModule(data: CreateTrainingModuleData) {
    try {
      const module = await TrainingModule.create({
        ...data,
        isRequired: data.isRequired ?? false,
        order: data.order ?? 0,
        attachments: data.attachments ?? [],
        isActive: true
      });

      logger.info(`Training module created: ${module.title} (${module.category})`);
      return module;
    } catch (error) {
      logger.error('Error creating training module:', error);
      throw error;
    }
  }

  /**
   * Get training modules, optionally filtered by category
   */
  static async getTrainingModules(category?: TrainingCategory) {
    try {
      const whereClause: any = { isActive: true };

      if (category) {
        whereClause.category = category;
      }

      const modules = await TrainingModule.findAll({
        where: whereClause,
        order: [
          ['order', 'ASC'],
          ['title', 'ASC']
        ]
      });

      return modules;
    } catch (error) {
      logger.error('Error fetching training modules:', error);
      throw error;
    }
  }

  /**
   * Get training module by ID
   */
  static async getTrainingModuleById(id: string) {
    try {
      const module = await TrainingModule.findByPk(id, {
        include: [
          {
            model: TrainingCompletion,
            as: 'completions',
            attributes: ['id', 'userId', 'score', 'completedAt']
          }
        ]
      });

      if (!module) {
        throw new Error('Training module not found');
      }

      return module;
    } catch (error) {
      logger.error('Error fetching training module:', error);
      throw error;
    }
  }

  /**
   * Update training module
   */
  static async updateTrainingModule(id: string, data: Partial<CreateTrainingModuleData>) {
    try {
      const module = await TrainingModule.findByPk(id);

      if (!module) {
        throw new Error('Training module not found');
      }

      await module.update(data);

      logger.info(`Training module updated: ${module.title} (${id})`);
      return module;
    } catch (error) {
      logger.error('Error updating training module:', error);
      throw error;
    }
  }

  /**
   * Delete training module (soft delete)
   */
  static async deleteTrainingModule(id: string) {
    try {
      const module = await TrainingModule.findByPk(id);

      if (!module) {
        throw new Error('Training module not found');
      }

      // Soft delete
      await module.update({ isActive: false });

      logger.info(`Training module deleted: ${module.title} (${id})`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting training module:', error);
      throw error;
    }
  }

  /**
   * Record training completion
   */
  static async recordTrainingCompletion(moduleId: string, userId: string, score?: number) {
    try {
      // Verify module exists
      const module = await TrainingModule.findByPk(moduleId);
      if (!module) {
        throw new Error('Training module not found');
      }

      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find existing completion
      const existingCompletion = await TrainingCompletion.findOne({
        where: {
          userId,
          moduleId
        }
      });

      let completion: TrainingCompletion;

      if (existingCompletion) {
        // Update existing completion
        await existingCompletion.update({
          score,
          completedAt: new Date()
        });
        completion = existingCompletion;
      } else {
        // Create new completion
        completion = await TrainingCompletion.create({
          moduleId,
          userId,
          score,
          completedAt: new Date()
        });
      }

      logger.info(`Training completion recorded: ${module.title} for user ${userId}`);
      return completion;
    } catch (error) {
      logger.error('Error recording training completion:', error);
      throw error;
    }
  }

  /**
   * Get user training progress
   */
  static async getUserTrainingProgress(userId: string) {
    try {
      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const completions = await TrainingCompletion.findAll({
        where: { userId },
        include: [
          {
            model: TrainingModule,
            as: 'module',
            where: { isActive: true },
            required: true
          }
        ],
        order: [['completedAt', 'DESC']]
      });

      const totalModules = await TrainingModule.count({ where: { isActive: true } });
      const requiredModules = await TrainingModule.count({
        where: { isActive: true, isRequired: true }
      });

      const completedRequired = completions.filter(
        (c: any) => c.module.isRequired
      ).length;

      return {
        completions,
        totalModules,
        completedModules: completions.length,
        requiredModules,
        completedRequired,
        completionPercentage: totalModules > 0 ? (completions.length / totalModules) * 100 : 0
      };
    } catch (error) {
      logger.error('Error fetching user training progress:', error);
      throw error;
    }
  }

  // ==================== AUDIT LOGGING ====================

  /**
   * Create an audit log entry
   */
  static async createAuditLog(
    action: AuditAction,
    entityType: string,
    entityId?: string,
    userId?: string,
    changes?: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      const audit = await AuditLog.create({
        action,
        entityType,
        entityId,
        userId,
        changes,
        ipAddress,
        userAgent
      });

      return audit;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: string;
      entityType?: string;
      entityId?: string;
      action?: AuditAction;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      if (filters) {
        if (filters.userId) {
          whereClause.userId = filters.userId;
        }
        if (filters.entityType) {
          whereClause.entityType = filters.entityType;
        }
        if (filters.entityId) {
          whereClause.entityId = filters.entityId;
        }
        if (filters.action) {
          whereClause.action = filters.action;
        }

        if (filters.startDate || filters.endDate) {
          whereClause.createdAt = {};
          if (filters.startDate) {
            whereClause.createdAt[Op.gte] = filters.startDate;
          }
          if (filters.endDate) {
            whereClause.createdAt[Op.lte] = filters.endDate;
          }
        }
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  // ==================== USER MANAGEMENT (Delegated) ====================
  // Note: These methods delegate to UserService but are included here for API compatibility

  /**
   * Get users with filtering (delegates to UserService)
   */
  static async getUsers(filters?: {
    search?: string;
    role?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters?.role) {
        whereClause.role = filters.role;
      }

      if (filters?.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      if (filters?.search) {
        whereClause[Op.or] = [
          { firstName: { [Op.iLike]: `%${filters.search}%` } },
          { lastName: { [Op.iLike]: `%${filters.search}%` } },
          { email: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      const { rows: users, count: total } = await User.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Create user (delegates to UserService)
   */
  static async createUser(userData: UserData) {
    try {
      const user = await User.create(userData);

      // Create audit log
      await this.createAuditLog(
        AuditAction.CREATE,
        'User',
        user.id,
        undefined,
        { email: user.email, role: user.role }
      );

      logger.info(`User created: ${user.email}`);
      return user.toSafeObject();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user (delegates to UserService)
   */
  static async updateUser(
    id: string,
    userData: {
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      isActive?: boolean;
      schoolId?: string;
      districtId?: string;
    }
  ) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update(userData);

      // Create audit log
      await this.createAuditLog(AuditAction.UPDATE, 'User', user.id, undefined, userData);

      logger.info(`User updated: ${id}`);
      return user.toSafeObject();
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(id: string) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ isActive: false });

      // Create audit log
      await this.createAuditLog(AuditAction.DELETE, 'User', id, undefined, { deactivated: true });

      logger.info(`User deleted: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}
