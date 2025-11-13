/**
 * Admin Metrics Real-Time Service
 *
 * Provides real-time system metrics and admin dashboard data via WebSocket.
 * Integrates with existing WebSocket infrastructure to broadcast system health,
 * performance metrics, and admin activity updates to connected admin clients.
 *
 * @module infrastructure/websock@/services/admin-metrics.service
 * @category WebSocket Services
 * @requires WebSocketService
 * @requires SystemMonitoringService
 * @since 2025-11-05
 */

import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketService } from '../websocket.service';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
const execAsync = promisify(exec);

/**
 * System metrics interface
 */
export interface SystemMetrics {
  timestamp: string;
  system: {
    uptime: number;
    loadAverage: number[];
    platform: string;
    hostname: string;
    version: string;
  };
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  database: {
    connections: number;
    activeQueries: number;
    slowQueries: number;
    uptime: number;
  };
  websocket: {
    connectedClients: number;
    totalMessages: number;
    errors: number;
  };
}

/**
 * Admin activity interface
 */
export interface AdminActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details?: Record<string, any>;
}

/**
 * System alert interface
 */
export interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'system' | 'database' | 'websocket';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  details?: Record<string, any>;
}

@Injectable()
export class AdminMetricsService implements OnModuleInit, OnModuleDestroy {
  private isEnabled = false;
  private metricsInterval: NodeJS.Timeout | null = null;
  private previousCpuInfo: { totalTick: number; totalIdle: number } | null = null;

  // Metrics storage for trends
  private metricsHistory: SystemMetrics[] = [];
  private readonly maxHistorySize = 100; // Keep last 100 data points

  // Active alerts
  private activeAlerts = new Map<string, SystemAlert>();
  private alertThresholds = {
    cpu: 80,
    memory: 85,
    disk: 90,
    responseTime: 5000, // 5 seconds
    errorRate: 5, // 5%
  };

  constructor(
    @Optional()
    @Inject(forwardRef(() => WebSocketService))
    private readonly webSocketService?: WebSocketService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.isEnabled = this.configService.get<boolean>('ADMIN_METRICS_ENABLED', true);

    if (this.isEnabled) {
      this.logInfo('Admin Metrics Service initialized - Starting real-time monitoring');
      await this.startMetricsCollection();
    } else {
      this.logInfo('Admin Metrics Service disabled via configuration');
    }
  }

  async onModuleDestroy() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    this.logInfo('Admin Metrics Service stopped');
  }

  /**
   * Start collecting and broadcasting metrics
   */
  private async startMetricsCollection() {
    // Collect metrics every 5 seconds
    this.metricsInterval = setInterval(async () => {
      try {
        const metrics = await this.collectSystemMetrics();
        await this.processMetrics(metrics);
        await this.broadcastMetrics(metrics);
      } catch (error) {
        this.logError('Failed to collect/broadcast metrics:', error);
      }
    }, 5000);
  }

  /**
   * Collect comprehensive system metrics
   */
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    const timestamp = new Date().toISOString();

    // System info
    const uptime = os.uptime();
    const loadAverage = os.loadavg();
    const platform = os.platform();
    const hostname = os.hostname();
    const version = process.version;

    // CPU metrics
    const cpuInfo = await this.getCpuMetrics();

    // Memory metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryPercentage = (usedMem / totalMem) * 100;

    // Disk metrics
    const diskInfo = await this.getDiskMetrics();

    // Network metrics
    const networkInfo = await this.getNetworkMetrics();

    // Database metrics (placeholder - integrate with your database service)
    const databaseInfo = await this.getDatabaseMetrics();

    // WebSocket metrics
    const websocketInfo = await this.getWebSocketMetrics();

    return {
      timestamp,
      system: {
        uptime,
        loadAverage,
        platform,
        hostname,
        version,
      },
      cpu: {
        usage: cpuInfo.usage,
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        speed: os.cpus()[0]?.speed || 0,
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percentage: memoryPercentage,
      },
      disk: diskInfo,
      network: networkInfo,
      database: databaseInfo,
      websocket: websocketInfo,
    };
  }

  /**
   * Calculate CPU usage percentage
   */
  private async getCpuMetrics(): Promise<{ usage: number }> {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as Record<string, number>)[type];
      }
      totalIdle += cpu.times.idle;
    });

    if (this.previousCpuInfo) {
      const totalTickDiff = totalTick - this.previousCpuInfo.totalTick;
      const totalIdleDiff = totalIdle - this.previousCpuInfo.totalIdle;
      const usage = 100 - Math.round((100 * totalIdleDiff) / totalTickDiff);

      this.previousCpuInfo = { totalTick, totalIdle };
      return { usage: Math.max(0, Math.min(100, usage)) };
    } else {
      this.previousCpuInfo = { totalTick, totalIdle };
      return { usage: 0 };
    }
  }

  /**
   * Get disk usage metrics
   */
  private async getDiskMetrics(): Promise<{
    total: number;
    used: number;
    free: number;
    percentage: number;
  }> {
    try {
      // Use df command on Unix-like systems
      if (process.platform !== 'win32') {
        const { stdout } = await execAsync('df -h / | tail -1');
        const parts = stdout.trim().split(/\s+/);

        if (parts.length < 5) {
          this.logWarning('Unexpected df output format');
          return { total: 0, used: 0, free: 0, percentage: 0 };
        }

        const parseSize = (size: string): number => {
          const unit = size.slice(-1).toLowerCase();
          const value = parseFloat(size);
          const multipliers: Record<string, number> = {
            k: 1024,
            m: 1024 ** 2,
            g: 1024 ** 3,
            t: 1024 ** 4,
          };
          return value * (multipliers[unit] || 1);
        };

        const total = parseSize(parts[1]);
        const used = parseSize(parts[2]);
        const free = parseSize(parts[3]);
        const percentage = parseFloat(parts[4].replace('%', ''));

        return { total, used, free, percentage };
      } else {
        // Windows fallback - basic implementation
        return {
          total: 1000000000000, // 1TB placeholder
          used: 500000000000, // 500GB placeholder
          free: 500000000000, // 500GB placeholder
          percentage: 50,
        };
      }
    } catch (error) {
      this.logWarning('Failed to get disk metrics:', (error as Error).message);
      return { total: 0, used: 0, free: 0, percentage: 0 };
    }
  }

  /**
   * Get network metrics
   */
  private async getNetworkMetrics(): Promise<{
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  }> {
    try {
      // This is a simplified implementation
      // In production, you'd want to read from /proc/net/dev or similar

      // Placeholder values - integrate with your network monitoring
      return {
        bytesIn: Math.floor(Math.random() * 1000000),
        bytesOut: Math.floor(Math.random() * 1000000),
        packetsIn: Math.floor(Math.random() * 10000),
        packetsOut: Math.floor(Math.random() * 10000),
      };
    } catch (error) {
      this.logWarning('Failed to get network metrics:', (error as Error).message);
      return { bytesIn: 0, bytesOut: 0, packetsIn: 0, packetsOut: 0 };
    }
  }

  /**
   * Get database metrics - integrate with your database service
   */
  private async getDatabaseMetrics(): Promise<{
    connections: number;
    activeQueries: number;
    slowQueries: number;
    uptime: number;
  }> {
    try {
      // Placeholder - integrate with your database monitoring
      // This should query your actual database for real metrics
      return {
        connections: Math.floor(Math.random() * 50) + 10,
        activeQueries: Math.floor(Math.random() * 20),
        slowQueries: Math.floor(Math.random() * 5),
        uptime: os.uptime(),
      };
    } catch (error) {
      this.logWarning('Failed to get database metrics:', (error as Error).message);
      return { connections: 0, activeQueries: 0, slowQueries: 0, uptime: 0 };
    }
  }

  /**
   * Get WebSocket metrics
   */
  private async getWebSocketMetrics(): Promise<{
    connectedClients: number;
    totalMessages: number;
    errors: number;
  }> {
    try {
      // Get metrics from WebSocket gateway
      const connectedClients =
        this.webSocketService?.['websocketGateway']?.getConnectedSocketsCount() || 0;

      return {
        connectedClients,
        totalMessages: Math.floor(Math.random() * 10000), // Placeholder
        errors: Math.floor(Math.random() * 10), // Placeholder
      };
    } catch (error) {
      this.logWarning('Failed to get WebSocket metrics:', (error as Error).message);
      return { connectedClients: 0, totalMessages: 0, errors: 0 };
    }
  }

  /**
   * Process metrics and generate alerts
   */
  private async processMetrics(metrics: SystemMetrics) {
    // Store metrics in history
    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }

    // Check for alert conditions
    await this.checkAlertConditions(metrics);
  }

  /**
   * Check for alert conditions and generate alerts
   */
  private async checkAlertConditions(metrics: SystemMetrics) {
    const alerts: SystemAlert[] = [];

    // CPU usage alert
    if (metrics.cpu.usage > this.alertThresholds.cpu) {
      const alertId = 'cpu-high-usage';
      if (!this.activeAlerts.has(alertId)) {
        const alert: SystemAlert = {
          id: alertId,
          type: 'performance',
          severity: metrics.cpu.usage > 95 ? 'critical' : 'warning',
          title: 'High CPU Usage',
          message: `CPU usage is at ${metrics.cpu.usage.toFixed(1)}%`,
          timestamp: metrics.timestamp,
          acknowledged: false,
          details: {
            currentUsage: metrics.cpu.usage,
            threshold: this.alertThresholds.cpu,
          },
        };

        this.activeAlerts.set(alertId, alert);
        alerts.push(alert);
      }
    } else {
      this.activeAlerts.delete('cpu-high-usage');
    }

    // Memory usage alert
    if (metrics.memory.percentage > this.alertThresholds.memory) {
      const alertId = 'memory-high-usage';
      if (!this.activeAlerts.has(alertId)) {
        const alert: SystemAlert = {
          id: alertId,
          type: 'performance',
          severity: metrics.memory.percentage > 95 ? 'critical' : 'warning',
          title: 'High Memory Usage',
          message: `Memory usage is at ${metrics.memory.percentage.toFixed(1)}%`,
          timestamp: metrics.timestamp,
          acknowledged: false,
          details: {
            currentUsage: metrics.memory.percentage,
            threshold: this.alertThresholds.memory,
          },
        };

        this.activeAlerts.set(alertId, alert);
        alerts.push(alert);
      }
    } else {
      this.activeAlerts.delete('memory-high-usage');
    }

    // Disk usage alert
    if (metrics.disk.percentage > this.alertThresholds.disk) {
      const alertId = 'disk-high-usage';
      if (!this.activeAlerts.has(alertId)) {
        const alert: SystemAlert = {
          id: alertId,
          type: 'system',
          severity: metrics.disk.percentage > 95 ? 'critical' : 'warning',
          title: 'High Disk Usage',
          message: `Disk usage is at ${metrics.disk.percentage.toFixed(1)}%`,
          timestamp: metrics.timestamp,
          acknowledged: false,
          details: {
            currentUsage: metrics.disk.percentage,
            threshold: this.alertThresholds.disk,
          },
        };

        this.activeAlerts.set(alertId, alert);
        alerts.push(alert);
      }
    } else {
      this.activeAlerts.delete('disk-high-usage');
    }

    // Broadcast new alerts
    if (alerts.length > 0) {
      await this.broadcastAlerts(alerts);
    }
  }

  /**
   * Broadcast metrics to admin clients
   */
  private async broadcastMetrics(metrics: SystemMetrics) {
    try {
      // Broadcast to admin room
      if (this.webSocketService) {
        await this.webSocketService.broadcastToRoom('admin:metrics', 'admin:metrics:update', {
          metrics,
          trend: this.calculateTrend(),
          alerts: Array.from(this.activeAlerts.values()),
        });
      }
    } catch (error) {
      this.logError('Failed to broadcast metrics:', error);
    }
  }

  /**
   * Broadcast alerts to admin clients
   */
  private async broadcastAlerts(alerts: SystemAlert[]) {
    try {
      if (this.webSocketService) {
        for (const alert of alerts) {
          await this.webSocketService.broadcastToRoom('admin:alerts', 'admin:alert:new', alert);
        }
      }
    } catch (error) {
      this.logError('Failed to broadcast alerts:', error);
    }
  }

  /**
   * Calculate performance trend
   */
  private calculateTrend(): {
    cpu: 'up' | 'down' | 'stable';
    memory: 'up' | 'down' | 'stable';
    disk: 'up' | 'down' | 'stable';
  } {
    if (this.metricsHistory.length < 2) {
      return { cpu: 'stable', memory: 'stable', disk: 'stable' };
    }

    const current = this.getLatestMetric();
    const previous = this.getPreviousMetric();

    if (!current || !previous) {
      return { cpu: 'stable', memory: 'stable', disk: 'stable' };
    }

    const calculateDirection = (
      currentVal: number,
      previousVal: number,
    ): 'up' | 'down' | 'stable' => {
      const diff = currentVal - previousVal;
      if (Math.abs(diff) < 1) return 'stable';
      return diff > 0 ? 'up' : 'down';
    };

    return {
      cpu: calculateDirection(current.cpu.usage, previous.cpu.usage),
      memory: calculateDirection(current.memory.percentage, previous.memory.percentage),
      disk: calculateDirection(current.disk.percentage, previous.disk.percentage),
    };
  }

  /**
   * Get the latest recorded metric.
   * @returns The latest SystemMetrics object or null if history is empty.
   */
  getLatestMetric(): SystemMetrics | null {
    return this.metricsHistory[this.metricsHistory.length - 1] ?? null;
  }

  /**
   * Get the second to last recorded metric.
   * @returns The previous SystemMetrics object or null if history has less than 2 entries.
   */
  getPreviousMetric(): SystemMetrics | null {
    return this.metricsHistory[this.metricsHistory.length - 2] ?? null;
  }

  /**
   * Log admin activity and broadcast to monitoring clients
   */
  async logAdminActivity(activity: Omit<AdminActivity, 'id' | 'timestamp'>): Promise<void> {
    const adminActivity: AdminActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...activity,
    };

    try {
      // Broadcast to admin activity room
      await this.webSocketService.broadcastToRoom(
        'admin:activity',
        'admin:activity:new',
        adminActivity,
      );

      this.logInfo(`Admin activity logged: ${activity.action} by ${activity.userName}`, {
        userId: activity.userId,
        action: activity.action,
        resource: activity.resource,
        severity: activity.severity,
      });
    } catch (error) {
      this.logError('Failed to broadcast admin activity:', error);
    }
  }

  /**
   * Get current system metrics snapshot
   */
  async getCurrentMetrics(): Promise<SystemMetrics | null> {
    if (this.metricsHistory.length === 0) {
      return await this.collectSystemMetrics();
    }
    return this.getLatestMetric();
  }

  /**
   * Get metrics history for charts
   */
  getMetricsHistory(limit = 50): SystemMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): SystemAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.activeAlerts.set(alertId, alert);

      // Broadcast alert acknowledgment
      if (this.webSocketService) {
        await this.webSocketService.broadcastToRoom('admin:alerts', 'admin:alert:acknowledged', {
          alertId,
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      this.logInfo(`Alert ${alertId} acknowledged by user ${userId}`);
    }
  }

  /**
   * Get system health status based on current metrics
   */
  getSystemHealthStatus(): 'healthy' | 'degraded' | 'critical' {
    const alerts = Array.from(this.activeAlerts.values());

    if (alerts.some((alert) => alert.severity === 'critical')) {
      return 'critical';
    }

    if (alerts.some((alert) => alert.severity === 'warning' || alert.severity === 'error')) {
      return 'degraded';
    }

    return 'healthy';
  }
}
