/**
 * @fileoverview Resource Monitor Service
 * @module infrastructure/monitoring/services
 * @description Service for monitoring system resources (CPU, memory, disk, network)
 */

import { Injectable, Logger } from '@nestjs/common';
import { ResourceHealthInfo } from '../types/health-check.types';
import * as os from 'os';

import { BaseService } from '@/common/base';
@Injectable()
export class ResourceMonitorService extends BaseService {
  /**
   * Checks system resource utilization
   */
  async checkResourceHealth(): Promise<ResourceHealthInfo> {
    // Get CPU information
    const cpuInfo = this.getCpuInfo();

    // Get memory information
    const memoryInfo = this.getMemoryInfo();

    // Get disk information
    const diskInfo = await this.getDiskInfo();

    // Get network information
    const networkInfo = this.getNetworkInfo();

    return {
      cpu: cpuInfo,
      memory: memoryInfo,
      disk: diskInfo,
      network: networkInfo,
    };
  }

  /**
   * Gets CPU information
   */
  private getCpuInfo() {
    const usage = Math.random() * 100; // Mock - use actual CPU monitoring in production
    const load = [Math.random(), Math.random(), Math.random()];

    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const cores = require('os').cpus().length;

    return {
      usage: Math.round(usage * 100) / 100,
      load,
      cores,
    };
  }

  /**
   * Gets memory information
   */
  private getMemoryInfo() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const process = require('process');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const memUsage = process.memoryUsage();
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const totalMem = require('os').totalmem();
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const freeMem = require('os').freemem();
    const usedMem = totalMem - freeMem;

    return {
      used: usedMem,
      total: totalMem,
      usage: (usedMem / totalMem) * 100,
      heap: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
      },
    };
  }

  /**
   * Gets disk information
   */
  private getDiskInfo() {
    // Mock disk info - in production, use actual disk monitoring
    const total = 100 * 1024 * 1024 * 1024; // 100GB
    const used = Math.random() * total;

    return Promise.resolve({
      used: Math.round(used),
      total,
      usage: (used / total) * 100,
      path: '/',
    });
  }

  /**
   * Gets network information
   */
  private getNetworkInfo() {
    // Mock network info - in production, use actual network monitoring
    return {
      connections: Math.floor(Math.random() * 100),
      bytesIn: Math.floor(Math.random() * 1024 * 1024),
      bytesOut: Math.floor(Math.random() * 1024 * 1024),
    };
  }

  /**
   * Checks if resources are within acceptable thresholds
   */
  checkResourceThresholds(resources: ResourceHealthInfo, thresholds: {
    cpu: number;
    memory: number;
    disk: number;
  }): {
    cpuOk: boolean;
    memoryOk: boolean;
    diskOk: boolean;
    overallOk: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    const cpuOk = resources.cpu.usage <= thresholds.cpu;
    const memoryOk = resources.memory.usage <= thresholds.memory;
    const diskOk = resources.disk.usage <= thresholds.disk;

    if (!cpuOk) {
      issues.push(`High CPU usage: ${resources.cpu.usage}% (threshold: ${thresholds.cpu}%)`);
    }

    if (!memoryOk) {
      issues.push(`High memory usage: ${resources.memory.usage}% (threshold: ${thresholds.memory}%)`);
    }

    if (!diskOk) {
      issues.push(`High disk usage: ${resources.disk.usage}% (threshold: ${thresholds.disk}%)`);
    }

    return {
      cpuOk,
      memoryOk,
      diskOk,
      overallOk: cpuOk && memoryOk && diskOk,
      issues,
    };
  }

  /**
   * Gets resource usage trends
   */
  getResourceTrends(history: ResourceHealthInfo[]): {
    cpuTrend: number[];
    memoryTrend: number[];
    diskTrend: number[];
  } {
    const recentHistory = history.slice(-20);

    return {
      cpuTrend: recentHistory.map(h => h.cpu.usage),
      memoryTrend: recentHistory.map(h => h.memory.usage),
      diskTrend: recentHistory.map(h => h.disk.usage),
    };
  }
}
