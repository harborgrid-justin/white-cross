import { PrismaClient, MetricType, AuditAction, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// District Management
export interface CreateDistrictData {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdateDistrictData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

// School Management
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
  studentCount?: number;
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
  studentCount?: number;
  isActive?: boolean;
}

// System Configuration
export interface ConfigurationData {
  key: string;
  value: string;
  category: 'GENERAL' | 'SECURITY' | 'NOTIFICATION' | 'INTEGRATION' | 'BACKUP' | 'PERFORMANCE';
  description?: string;
  isPublic?: boolean;
}

// Backup
export interface BackupData {
  type: 'AUTOMATIC' | 'MANUAL' | 'SCHEDULED';
  triggeredBy?: string;
}

// License
export interface CreateLicenseData {
  licenseKey: string;
  type: 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: Date;
  districtId?: string;
}

// Training Module
export interface CreateTrainingModuleData {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: 'HIPAA_COMPLIANCE' | 'MEDICATION_MANAGEMENT' | 'EMERGENCY_PROCEDURES' | 'SYSTEM_TRAINING' | 'SAFETY_PROTOCOLS' | 'DATA_SECURITY';
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

export class AdministrationService {
  // ==================== District Management ====================
  
  static async createDistrict(data: CreateDistrictData) {
    try {
      const district = await prisma.district.create({
        data
      });

      logger.info(`District created: ${district.id}`);
      return district;
    } catch (error) {
      logger.error('Error creating district:', error);
      throw error;
    }
  }

  static async getDistricts(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [districts, total] = await Promise.all([
        prisma.district.findMany({
          skip,
          take: limit,
          include: {
            schools: true,
            _count: {
              select: { schools: true }
            }
          },
          orderBy: { name: 'asc' }
        }),
        prisma.district.count()
      ]);

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
      throw error;
    }
  }

  static async getDistrictById(id: string) {
    try {
      const district = await prisma.district.findUnique({
        where: { id },
        include: {
          schools: true,
          licenses: true
        }
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

  static async updateDistrict(id: string, data: UpdateDistrictData) {
    try {
      const district = await prisma.district.update({
        where: { id },
        data
      });

      logger.info(`District updated: ${id}`);
      return district;
    } catch (error) {
      logger.error('Error updating district:', error);
      throw error;
    }
  }

  static async deleteDistrict(id: string) {
    try {
      await prisma.district.delete({
        where: { id }
      });

      logger.info(`District deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting district:', error);
      throw error;
    }
  }

  // ==================== School Management ====================
  
  static async createSchool(data: CreateSchoolData) {
    try {
      const school = await prisma.school.create({
        data,
        include: {
          district: true
        }
      });

      logger.info(`School created: ${school.id}`);
      return school;
    } catch (error) {
      logger.error('Error creating school:', error);
      throw error;
    }
  }

  static async getSchools(page: number = 1, limit: number = 20, districtId?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = districtId ? { districtId } : {};

      const [schools, total] = await Promise.all([
        prisma.school.findMany({
          where,
          skip,
          take: limit,
          include: {
            district: true
          },
          orderBy: { name: 'asc' }
        }),
        prisma.school.count({ where })
      ]);

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
      throw error;
    }
  }

  static async getSchoolById(id: string) {
    try {
      const school = await prisma.school.findUnique({
        where: { id },
        include: {
          district: true
        }
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

  static async updateSchool(id: string, data: UpdateSchoolData) {
    try {
      const school = await prisma.school.update({
        where: { id },
        data,
        include: {
          district: true
        }
      });

      logger.info(`School updated: ${id}`);
      return school;
    } catch (error) {
      logger.error('Error updating school:', error);
      throw error;
    }
  }

  static async deleteSchool(id: string) {
    try {
      await prisma.school.delete({
        where: { id }
      });

      logger.info(`School deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting school:', error);
      throw error;
    }
  }

  // ==================== System Configuration ====================
  
  static async getConfiguration(key: string) {
    try {
      const config = await prisma.systemConfiguration.findUnique({
        where: { key }
      });

      return config;
    } catch (error) {
      logger.error('Error fetching configuration:', error);
      throw error;
    }
  }

  static async getAllConfigurations(category?: string) {
    try {
      const where = category ? { category: category as any } : {};
      
      const configs = await prisma.systemConfiguration.findMany({
        where,
        orderBy: [{ category: 'asc' }, { key: 'asc' }]
      });

      return configs;
    } catch (error) {
      logger.error('Error fetching configurations:', error);
      throw error;
    }
  }

  static async setConfiguration(data: ConfigurationData) {
    try {
      const config = await prisma.systemConfiguration.upsert({
        where: { key: data.key },
        update: {
          value: data.value,
          category: data.category,
          description: data.description,
          isPublic: data.isPublic
        },
        create: data
      });

      logger.info(`Configuration set: ${data.key}`);
      return config;
    } catch (error) {
      logger.error('Error setting configuration:', error);
      throw error;
    }
  }

  static async deleteConfiguration(key: string) {
    try {
      await prisma.systemConfiguration.delete({
        where: { key }
      });

      logger.info(`Configuration deleted: ${key}`);
    } catch (error) {
      logger.error('Error deleting configuration:', error);
      throw error;
    }
  }

  // ==================== Backup & Recovery ====================
  
  static async createBackup(data: BackupData) {
    try {
      const backup = await prisma.backupLog.create({
        data: {
          type: data.type,
          status: 'IN_PROGRESS',
          startedAt: new Date(),
          triggeredBy: data.triggeredBy
        }
      });

      logger.info(`Backup started: ${backup.id}`);
      
      // In a real implementation, this would trigger actual backup process
      // For now, we'll just simulate it
      setTimeout(async () => {
        await prisma.backupLog.update({
          where: { id: backup.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            fileName: `backup_${backup.id}.sql`,
            fileSize: Math.floor(Math.random() * 1000000000), // Simulated size
            location: '/backups'
          }
        });
        logger.info(`Backup completed: ${backup.id}`);
      }, 1000);

      return backup;
    } catch (error) {
      logger.error('Error creating backup:', error);
      throw error;
    }
  }

  static async getBackupLogs(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [backups, total] = await Promise.all([
        prisma.backupLog.findMany({
          skip,
          take: limit,
          orderBy: { startedAt: 'desc' }
        }),
        prisma.backupLog.count()
      ]);

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
      throw error;
    }
  }

  // ==================== Performance Monitoring ====================
  
  static async recordMetric(
    metricType: string,
    value: number,
    unit?: string,
    context?: Prisma.InputJsonValue
  ) {
    try {
      const metric = await prisma.performanceMetric.create({
        data: {
          metricType: metricType as MetricType,
          value,
          unit,
          context
        }
      });

      return metric;
    } catch (error) {
      logger.error('Error recording metric:', error);
      throw error;
    }
  }

  static async getMetrics(
    metricType?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const where: Prisma.PerformanceMetricWhereInput = {};
      
      if (metricType) {
        where.metricType = metricType as MetricType;
      }
      
      if (startDate || endDate) {
        where.recordedAt = {};
        if (startDate) where.recordedAt.gte = startDate;
        if (endDate) where.recordedAt.lte = endDate;
      }

      const metrics = await prisma.performanceMetric.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        take: 1000
      });

      return metrics;
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      throw error;
    }
  }

  static async getSystemHealth() {
    try {
      // Get recent metrics
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // Last hour

      const metrics = await prisma.performanceMetric.findMany({
        where: {
          recordedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { recordedAt: 'desc' }
      });

      // Calculate averages
      const metricsByType: Record<string, number[]> = {};
      metrics.forEach((metric) => {
        if (!metricsByType[metric.metricType]) {
          metricsByType[metric.metricType] = [];
        }
        metricsByType[metric.metricType].push(metric.value);
      });

      const averages: Record<string, number> = {};
      Object.keys(metricsByType).forEach(type => {
        const values = metricsByType[type];
        averages[type] = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      });

      // Get system statistics
      const [userCount, activeUserCount, districtCount, schoolCount] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.district.count(),
        prisma.school.count()
      ]);

      return {
        metrics: averages,
        statistics: {
          totalUsers: userCount,
          activeUsers: activeUserCount,
          totalDistricts: districtCount,
          totalSchools: schoolCount
        },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error fetching system health:', error);
      throw error;
    }
  }

  // ==================== License Management ====================
  
  static async createLicense(data: CreateLicenseData) {
    try {
      const license = await prisma.license.create({
        data: {
          ...data,
          activatedAt: new Date()
        },
        include: {
          district: true
        }
      });

      logger.info(`License created: ${license.id}`);
      return license;
    } catch (error) {
      logger.error('Error creating license:', error);
      throw error;
    }
  }

  static async getLicenses(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [licenses, total] = await Promise.all([
        prisma.license.findMany({
          skip,
          take: limit,
          include: {
            district: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.license.count()
      ]);

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
      throw error;
    }
  }

  static async getLicenseById(id: string) {
    try {
      const license = await prisma.license.findUnique({
        where: { id },
        include: {
          district: true
        }
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

  static async updateLicense(id: string, data: Partial<CreateLicenseData> & { status?: string }) {
    try {
      const license = await prisma.license.update({
        where: { id },
        data: data as any,
        include: {
          district: true
        }
      });

      logger.info(`License updated: ${id}`);
      return license;
    } catch (error) {
      logger.error('Error updating license:', error);
      throw error;
    }
  }

  static async deactivateLicense(id: string) {
    try {
      const license = await prisma.license.update({
        where: { id },
        data: {
          status: 'SUSPENDED',
          deactivatedAt: new Date()
        }
      });

      logger.info(`License deactivated: ${id}`);
      return license;
    } catch (error) {
      logger.error('Error deactivating license:', error);
      throw error;
    }
  }

  // ==================== Training Module Management ====================
  
  static async createTrainingModule(data: CreateTrainingModuleData) {
    try {
      const module = await prisma.trainingModule.create({
        data
      });

      logger.info(`Training module created: ${module.id}`);
      return module;
    } catch (error) {
      logger.error('Error creating training module:', error);
      throw error;
    }
  }

  static async getTrainingModules(category?: string) {
    try {
      const where = category ? { category: category as any } : {};
      
      const modules = await prisma.trainingModule.findMany({
        where,
        include: {
          _count: {
            select: { completions: true }
          }
        },
        orderBy: [{ order: 'asc' }, { title: 'asc' }]
      });

      return modules;
    } catch (error) {
      logger.error('Error fetching training modules:', error);
      throw error;
    }
  }

  static async getTrainingModuleById(id: string) {
    try {
      const module = await prisma.trainingModule.findUnique({
        where: { id },
        include: {
          completions: true
        }
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

  static async updateTrainingModule(id: string, data: Partial<CreateTrainingModuleData>) {
    try {
      const module = await prisma.trainingModule.update({
        where: { id },
        data
      });

      logger.info(`Training module updated: ${id}`);
      return module;
    } catch (error) {
      logger.error('Error updating training module:', error);
      throw error;
    }
  }

  static async deleteTrainingModule(id: string) {
    try {
      await prisma.trainingModule.delete({
        where: { id }
      });

      logger.info(`Training module deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting training module:', error);
      throw error;
    }
  }

  static async recordTrainingCompletion(moduleId: string, userId: string, score?: number) {
    try {
      const completion = await prisma.trainingCompletion.upsert({
        where: {
          userId_moduleId: {
            userId,
            moduleId
          }
        },
        update: {
          score,
          completedAt: new Date()
        },
        create: {
          moduleId,
          userId,
          score
        }
      });

      logger.info(`Training completion recorded: ${completion.id}`);
      return completion;
    } catch (error) {
      logger.error('Error recording training completion:', error);
      throw error;
    }
  }

  static async getUserTrainingProgress(userId: string) {
    try {
      const completions = await prisma.trainingCompletion.findMany({
        where: { userId },
        include: {
          module: true
        },
        orderBy: { completedAt: 'desc' }
      });

      const totalModules = await prisma.trainingModule.count({ where: { isActive: true } });
      const requiredModules = await prisma.trainingModule.count({ 
        where: { isActive: true, isRequired: true } 
      });
      const completedRequired = completions.filter((c) => c.module.isRequired).length;

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

  // ==================== Audit Logging ====================
  
  static async createAuditLog(
    action: string,
    entityType: string,
    entityId?: string,
    userId?: string,
    changes?: Prisma.InputJsonValue,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      const audit = await prisma.auditLog.create({
        data: {
          action: action as AuditAction,
          entityType,
          entityId,
          userId,
          changes,
          ipAddress,
          userAgent
        }
      });

      return audit;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  static async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    filters?: {
      userId?: string;
      entityType?: string;
      entityId?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.AuditLogWhereInput = {};

      if (filters) {
        if (filters.userId) where.userId = filters.userId;
        if (filters.entityType) where.entityType = filters.entityType;
        if (filters.entityId) where.entityId = filters.entityId;
        if (filters.action) where.action = filters.action as AuditAction;
        
        if (filters.startDate || filters.endDate) {
          where.createdAt = {};
          if (filters.startDate) where.createdAt.gte = filters.startDate;
          if (filters.endDate) where.createdAt.lte = filters.endDate;
        }
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.auditLog.count({ where })
      ]);

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
      throw error;
    }
  }
}
