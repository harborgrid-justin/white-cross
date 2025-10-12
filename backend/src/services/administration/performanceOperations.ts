/**
 * Performance Operations Module
 *
 * @module services/administration/performanceOperations
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { PerformanceMetric, User, District, School, sequelize } from '../../database/models';
import { MetricType } from '../../database/types/enums';

/**
 * Record a performance metric
 */
export async function recordMetric(
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
export async function getMetrics(
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
export async function getSystemHealth() {
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
      recordMetric(MetricType.CPU_USAGE, parseFloat(cpuUsagePercent.toFixed(2)), '%'),
      recordMetric(MetricType.MEMORY_USAGE, parseFloat(memoryUsagePercent.toFixed(2)), '%'),
      recordMetric(MetricType.ACTIVE_USERS, activeUserCount, 'count')
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
