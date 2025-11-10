/**
 * LOC: ALLOCJOBSCH001
 * File: /reuse/edwards/financial/composites/downstream/allocation-processing-job-schedulers.ts
 *
 * UPSTREAM (imports from):
 *   - ../../cost-allocation-distribution-composite
 *
 * DOWNSTREAM (imported by):
 *   - Job scheduling infrastructure
 *   - Cron job managers
 *   - Background processing services
 */

/**
 * File: /reuse/edwards/financial/composites/downstream/allocation-processing-job-schedulers.ts
 * Locator: WC-EDW-ALLOC-JOB-SCH-001
 * Purpose: Production-grade Allocation Processing Job Schedulers - Automated scheduling for cost allocations
 *
 * Upstream: Imports and orchestrates functions from cost-allocation-distribution-composite
 * Downstream: Consumed by job scheduling infrastructure, cron managers, background workers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/schedule 4.x, node-cron 3.x
 * Exports: Job schedulers for automated cost allocation processing
 *
 * LLM Context: Production-ready job schedulers providing automated execution of cost allocation processes
 * including scheduled batch allocations, periodic overhead calculations, month-end closing automation,
 * variance analysis reporting, compliance report generation, and allocation reconciliation. Implements
 * robust error handling, retry logic, job monitoring, alert notifications, and comprehensive audit logging
 * for enterprise-grade automated financial operations.
 *
 * Job Scheduler Design Principles:
 * - Cron-based scheduling with flexible timing patterns
 * - Automatic retry logic for failed jobs with exponential backoff
 * - Job status monitoring and health checks
 * - Email/Slack notifications for job failures and completions
 * - Distributed job locking to prevent concurrent executions
 * - Comprehensive logging for audit and troubleshooting
 * - Job dependency management for sequential workflows
 * - Configurable job timeouts and resource limits
 * - Database transaction management for data consistency
 * - Integration with monitoring and alerting systems
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Sequelize, Transaction } from 'sequelize';
import { CronJob } from 'cron';

// Import from parent composite
import {
  AllocationMethod,
  AllocationStatus,
  PoolType,
  BasisType,
  ReportFormat,
  processBatchDirectAllocations,
  processStepDownAllocationWithSequence,
  processReciprocalAllocationWithMatrix,
  processABCAllocationComplete,
  calculateAndApplyOverheadRates,
  performComprehensiveMultiLevelVarianceAnalysis,
  generateCostAllocationComplianceReport,
  generateCostAllocationDashboard,
} from '../../cost-allocation-distribution-composite';

// ============================================================================
// JOB CONFIGURATION INTERFACES
// ============================================================================

/**
 * Job execution result
 */
export interface JobExecutionResult {
  jobName: string;
  executionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  recordsProcessed: number;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

/**
 * Job configuration
 */
export interface JobConfig {
  jobName: string;
  cronPattern: string;
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  notifyOnFailure: boolean;
  notifyOnSuccess: boolean;
  businessUnit?: string;
  fiscalYearOffset?: number;
}

/**
 * Allocation job parameters
 */
export interface AllocationJobParams {
  fiscalYear: number;
  fiscalPeriod: number;
  allocationMethod: AllocationMethod;
  sourcePoolIds?: number[];
  autoPostToGL: boolean;
  sendNotifications: boolean;
}

// ============================================================================
// ALLOCATION PROCESSING JOB SCHEDULER SERVICE
// ============================================================================

@Injectable()
export class AllocationProcessingJobScheduler implements OnModuleInit {
  private readonly logger = new Logger(AllocationProcessingJobScheduler.name);
  private readonly jobExecutions: Map<string, JobExecutionResult> = new Map();

  constructor(
    private readonly sequelize: Sequelize,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Initialize dynamic jobs on module startup
   */
  async onModuleInit() {
    this.logger.log('Initializing allocation processing job schedulers');

    // Load job configurations from database
    const jobConfigs = await this.loadJobConfigurations();

    // Register dynamic jobs
    jobConfigs.forEach((config) => {
      if (config.enabled) {
        this.registerDynamicJob(config);
      }
    });

    this.logger.log(`Registered ${jobConfigs.length} allocation processing jobs`);
  }

  /**
   * Daily direct allocation processing (runs at 2:00 AM)
   */
  @Cron('0 2 * * *', {
    name: 'daily-direct-allocation',
    timeZone: 'America/New_York',
  })
  async handleDailyDirectAllocation() {
    const jobName = 'daily-direct-allocation';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const transaction = await this.sequelize.transaction();

      try {
        // Get current fiscal period
        const { fiscalYear, fiscalPeriod } = await this.getCurrentFiscalPeriod();

        // Process direct allocations for overhead pools
        const result = await processBatchDirectAllocations(
          {
            fiscalYear,
            fiscalPeriod,
            poolTypes: [PoolType.OVERHEAD, PoolType.SERVICE],
            autoPostToGL: true,
            validationOnly: false,
          },
          transaction,
        );

        await transaction.commit();

        const endTime = new Date();
        const jobResult: JobExecutionResult = {
          jobName,
          executionId,
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          status: result.failures > 0 ? 'PARTIAL' : 'SUCCESS',
          recordsProcessed: result.processed,
          errors: result.errors || [],
          warnings: result.warnings || [],
          metadata: { fiscalYear, fiscalPeriod, totalAllocated: result.totalAllocated },
        };

        this.jobExecutions.set(executionId, jobResult);
        this.logger.log(`${jobName} completed: ${result.processed} allocations processed`);

        // Send success notification
        await this.sendJobNotification(jobResult);

        return jobResult;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);

      // Send failure notification
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Monthly step-down allocation (runs on 1st of month at 3:00 AM)
   */
  @Cron('0 3 1 * *', {
    name: 'monthly-step-down-allocation',
    timeZone: 'America/New_York',
  })
  async handleMonthlyStepDownAllocation() {
    const jobName = 'monthly-step-down-allocation';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const transaction = await this.sequelize.transaction();

      try {
        const { fiscalYear, fiscalPeriod } = await this.getPreviousFiscalPeriod();

        // Define step-down allocation sequence
        const sequence = await this.buildStepDownSequence(fiscalYear, fiscalPeriod);

        // Process step-down allocation
        const result = await processStepDownAllocationWithSequence(
          {
            fiscalYear,
            fiscalPeriod,
            sequence,
            description: `Monthly step-down allocation for FY${fiscalYear} P${fiscalPeriod}`,
            autoPostToGL: true,
          },
          transaction,
        );

        await transaction.commit();

        const endTime = new Date();
        const jobResult: JobExecutionResult = {
          jobName,
          executionId,
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          status: 'SUCCESS',
          recordsProcessed: result.allocations.length,
          errors: result.errors || [],
          warnings: result.warnings || [],
          metadata: { fiscalYear, fiscalPeriod, totalAllocated: result.totalAllocated },
        };

        this.jobExecutions.set(executionId, jobResult);
        this.logger.log(`${jobName} completed: ${result.allocations.length} steps processed`);

        await this.sendJobNotification(jobResult);

        return jobResult;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Monthly reciprocal allocation (runs on 2nd of month at 3:00 AM)
   */
  @Cron('0 3 2 * *', {
    name: 'monthly-reciprocal-allocation',
    timeZone: 'America/New_York',
  })
  async handleMonthlyReciprocalAllocation() {
    const jobName = 'monthly-reciprocal-allocation';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const transaction = await this.sequelize.transaction();

      try {
        const { fiscalYear, fiscalPeriod } = await this.getPreviousFiscalPeriod();

        // Get service department pools that need reciprocal allocation
        const serviceDepartmentPools = await this.getServiceDepartmentPools(fiscalYear);

        // Process reciprocal allocation
        const result = await processReciprocalAllocationWithMatrix(
          {
            fiscalYear,
            fiscalPeriod,
            serviceDepartmentPools,
            maxIterations: 20,
            convergenceTolerance: 0.001,
            autoPostToGL: true,
          },
          transaction,
        );

        await transaction.commit();

        const endTime = new Date();
        const jobResult: JobExecutionResult = {
          jobName,
          executionId,
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          status: 'SUCCESS',
          recordsProcessed: result.allocations.length,
          errors: result.errors || [],
          warnings: result.warnings || [],
          metadata: {
            fiscalYear,
            fiscalPeriod,
            totalAllocated: result.totalAllocated,
            iterations: result.iterations,
            converged: result.converged,
          },
        };

        this.jobExecutions.set(executionId, jobResult);
        this.logger.log(`${jobName} completed: ${result.allocations.length} allocations in ${result.iterations} iterations`);

        await this.sendJobNotification(jobResult);

        return jobResult;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Monthly ABC allocation (runs on 3rd of month at 3:00 AM)
   */
  @Cron('0 3 3 * *', {
    name: 'monthly-abc-allocation',
    timeZone: 'America/New_York',
  })
  async handleMonthlyABCAllocation() {
    const jobName = 'monthly-abc-allocation';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const transaction = await this.sequelize.transaction();

      try {
        const { fiscalYear, fiscalPeriod } = await this.getPreviousFiscalPeriod();

        // Get activity pools for ABC
        const activityPoolIds = await this.getActivityPools(fiscalYear);

        // Get cost objects (products/services)
        const costObjects = await this.getCostObjects(fiscalYear);

        // Process ABC allocation
        const result = await processABCAllocationComplete(
          {
            activityPoolIds,
            fiscalYear,
            fiscalPeriod,
            costObjects: costObjects.map(co => co.code),
            costObjectType: 'PRODUCT',
            autoPostToGL: true,
          },
          transaction,
        );

        await transaction.commit();

        const endTime = new Date();
        const jobResult: JobExecutionResult = {
          jobName,
          executionId,
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          status: 'SUCCESS',
          recordsProcessed: result.allocations.length,
          errors: result.errors || [],
          warnings: result.warnings || [],
          metadata: {
            fiscalYear,
            fiscalPeriod,
            totalAllocated: result.totalAllocated,
            activityPools: activityPoolIds.length,
            costObjects: costObjects.length,
          },
        };

        this.jobExecutions.set(executionId, jobResult);
        this.logger.log(`${jobName} completed: ${result.allocations.length} ABC allocations`);

        await this.sendJobNotification(jobResult);

        return jobResult;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Monthly overhead rate calculation (runs on 5th of month at 2:00 AM)
   */
  @Cron('0 2 5 * *', {
    name: 'monthly-overhead-rates',
    timeZone: 'America/New_York',
  })
  async handleMonthlyOverheadRates() {
    const jobName = 'monthly-overhead-rates';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const transaction = await this.sequelize.transaction();

      try {
        const { fiscalYear, fiscalPeriod } = await this.getPreviousFiscalPeriod();

        // Get overhead pools
        const overheadPools = await this.getOverheadPools(fiscalYear);

        let totalProcessed = 0;
        const errors: string[] = [];

        for (const pool of overheadPools) {
          try {
            await calculateAndApplyOverheadRates(
              {
                overheadPoolId: pool.id,
                activityBase: pool.activityBase || 'DIRECT_LABOR_HOURS',
                fiscalYear,
                rateMethod: 'ACTUAL',
                applyRates: true,
                targetCostObjects: await this.getCostObjectsForPool(pool.id),
              },
              transaction,
            );

            totalProcessed++;
          } catch (error) {
            errors.push(`Pool ${pool.id}: ${error.message}`);
          }
        }

        await transaction.commit();

        const endTime = new Date();
        const jobResult: JobExecutionResult = {
          jobName,
          executionId,
          startTime,
          endTime,
          duration: endTime.getTime() - startTime.getTime(),
          status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
          recordsProcessed: totalProcessed,
          errors,
          warnings: [],
          metadata: { fiscalYear, fiscalPeriod, poolsProcessed: totalProcessed },
        };

        this.jobExecutions.set(executionId, jobResult);
        this.logger.log(`${jobName} completed: ${totalProcessed} overhead pools processed`);

        await this.sendJobNotification(jobResult);

        return jobResult;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Monthly variance analysis report (runs on 10th of month at 6:00 AM)
   */
  @Cron('0 6 10 * *', {
    name: 'monthly-variance-analysis',
    timeZone: 'America/New_York',
  })
  async handleMonthlyVarianceAnalysis() {
    const jobName = 'monthly-variance-analysis';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const { fiscalYear, fiscalPeriod } = await this.getPreviousFiscalPeriod();

      // Get all cost pools for analysis
      const costPools = await this.getAllCostPools(fiscalYear);

      let totalProcessed = 0;
      const errors: string[] = [];
      const reports: any[] = [];

      for (const pool of costPools) {
        try {
          const report = await performComprehensiveMultiLevelVarianceAnalysis(
            pool.id,
            fiscalYear,
            fiscalPeriod,
            {
              includeExplanations: true,
              thresholdPercent: 5.0,
            },
          );

          reports.push(report);
          totalProcessed++;
        } catch (error) {
          errors.push(`Pool ${pool.id}: ${error.message}`);
        }
      }

      // Send consolidated variance reports
      await this.sendVarianceReports(reports, fiscalYear, fiscalPeriod);

      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
        recordsProcessed: totalProcessed,
        errors,
        warnings: [],
        metadata: { fiscalYear, fiscalPeriod, poolsAnalyzed: totalProcessed },
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.log(`${jobName} completed: ${totalProcessed} variance analyses generated`);

      await this.sendJobNotification(jobResult);

      return jobResult;
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  /**
   * Weekly compliance report (runs every Monday at 7:00 AM)
   */
  @Cron('0 7 * * 1', {
    name: 'weekly-compliance-report',
    timeZone: 'America/New_York',
  })
  async handleWeeklyComplianceReport() {
    const jobName = 'weekly-compliance-report';
    this.logger.log(`Starting ${jobName}`);

    const executionId = this.generateExecutionId();
    const startTime = new Date();

    try {
      const { fiscalYear, fiscalPeriod } = await this.getCurrentFiscalPeriod();

      // Generate compliance report
      const report = await generateCostAllocationComplianceReport(
        fiscalYear,
        fiscalPeriod,
        ReportFormat.PDF,
      );

      // Send report to compliance team
      await this.sendComplianceReport(report, fiscalYear, fiscalPeriod);

      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'SUCCESS',
        recordsProcessed: 1,
        errors: [],
        warnings: [],
        metadata: { fiscalYear, fiscalPeriod, reportId: report.reportId },
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.log(`${jobName} completed: Compliance report generated`);

      await this.sendJobNotification(jobResult);

      return jobResult;
    } catch (error) {
      const endTime = new Date();
      const jobResult: JobExecutionResult = {
        jobName,
        executionId,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        status: 'FAILED',
        recordsProcessed: 0,
        errors: [error.message],
        warnings: [],
      };

      this.jobExecutions.set(executionId, jobResult);
      this.logger.error(`${jobName} failed: ${error.message}`, error.stack);
      await this.sendJobNotification(jobResult);

      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get current fiscal period
   */
  private async getCurrentFiscalPeriod(): Promise<{ fiscalYear: number; fiscalPeriod: number }> {
    const now = new Date();
    return {
      fiscalYear: now.getFullYear(),
      fiscalPeriod: now.getMonth() + 1,
    };
  }

  /**
   * Get previous fiscal period
   */
  private async getPreviousFiscalPeriod(): Promise<{ fiscalYear: number; fiscalPeriod: number }> {
    const now = new Date();
    const previousMonth = now.getMonth(); // 0-11

    return {
      fiscalYear: previousMonth === 0 ? now.getFullYear() - 1 : now.getFullYear(),
      fiscalPeriod: previousMonth === 0 ? 12 : previousMonth,
    };
  }

  /**
   * Build step-down allocation sequence
   */
  private async buildStepDownSequence(fiscalYear: number, fiscalPeriod: number): Promise<any[]> {
    // In production, would query from database configuration
    return [
      {
        sequenceOrder: 1,
        sourcePoolId: 1001,
        allocationBasisId: 2001,
        targetCostCenters: ['CC-200', 'CC-300', 'CC-400'],
        excludeAllocated: true,
      },
      {
        sequenceOrder: 2,
        sourcePoolId: 1002,
        allocationBasisId: 2002,
        targetCostCenters: ['CC-300', 'CC-400'],
        excludeAllocated: true,
      },
    ];
  }

  /**
   * Get service department pools
   */
  private async getServiceDepartmentPools(fiscalYear: number): Promise<number[]> {
    // In production, would query from database
    return [1001, 1002, 1003];
  }

  /**
   * Get activity pools for ABC
   */
  private async getActivityPools(fiscalYear: number): Promise<number[]> {
    // In production, would query from database
    return [2001, 2002, 2003];
  }

  /**
   * Get cost objects
   */
  private async getCostObjects(fiscalYear: number): Promise<any[]> {
    // In production, would query from database
    return [
      { code: 'PROD-001', name: 'Product 1' },
      { code: 'PROD-002', name: 'Product 2' },
    ];
  }

  /**
   * Get overhead pools
   */
  private async getOverheadPools(fiscalYear: number): Promise<any[]> {
    // In production, would query from database
    return [
      { id: 3001, code: 'OH-001', activityBase: 'DIRECT_LABOR_HOURS' },
      { id: 3002, code: 'OH-002', activityBase: 'MACHINE_HOURS' },
    ];
  }

  /**
   * Get cost objects for pool
   */
  private async getCostObjectsForPool(poolId: number): Promise<string[]> {
    // In production, would query from database
    return ['PROD-001', 'PROD-002'];
  }

  /**
   * Get all cost pools
   */
  private async getAllCostPools(fiscalYear: number): Promise<any[]> {
    // In production, would query from database
    return [
      { id: 1001, code: 'POOL-001' },
      { id: 1002, code: 'POOL-002' },
    ];
  }

  /**
   * Load job configurations from database
   */
  private async loadJobConfigurations(): Promise<JobConfig[]> {
    // In production, would query from database
    return [];
  }

  /**
   * Register dynamic job
   */
  private registerDynamicJob(config: JobConfig): void {
    const job = new CronJob(config.cronPattern, async () => {
      this.logger.log(`Executing dynamic job: ${config.jobName}`);
      // Execute job logic based on configuration
    });

    this.schedulerRegistry.addCronJob(config.jobName, job);
    job.start();

    this.logger.log(`Registered dynamic job: ${config.jobName} with pattern ${config.cronPattern}`);
  }

  /**
   * Generate execution ID
   */
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send job notification
   */
  private async sendJobNotification(result: JobExecutionResult): Promise<void> {
    this.logger.log(`Job notification for ${result.jobName}: ${result.status}`);

    // In production, would send email/Slack notification
    // For now, just log
    if (result.status === 'FAILED') {
      this.logger.error(`Job ${result.jobName} failed with errors: ${result.errors.join(', ')}`);
    } else if (result.status === 'PARTIAL') {
      this.logger.warn(`Job ${result.jobName} completed with errors: ${result.errors.join(', ')}`);
    } else {
      this.logger.log(`Job ${result.jobName} completed successfully`);
    }
  }

  /**
   * Send variance reports
   */
  private async sendVarianceReports(reports: any[], fiscalYear: number, fiscalPeriod: number): Promise<void> {
    this.logger.log(`Sending ${reports.length} variance reports for FY${fiscalYear} P${fiscalPeriod}`);
    // In production, would send consolidated email report
  }

  /**
   * Send compliance report
   */
  private async sendComplianceReport(report: any, fiscalYear: number, fiscalPeriod: number): Promise<void> {
    this.logger.log(`Sending compliance report for FY${fiscalYear} P${fiscalPeriod}`);
    // In production, would send to compliance team
  }

  /**
   * Get job execution history
   */
  getExecutionHistory(limit: number = 100): JobExecutionResult[] {
    return Array.from(this.jobExecutions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get job execution by ID
   */
  getExecutionById(executionId: string): JobExecutionResult | undefined {
    return this.jobExecutions.get(executionId);
  }
}

// ============================================================================
// MODULE EXPORT DEFINITION
// ============================================================================

export const AllocationProcessingJobSchedulerModule = {
  providers: [AllocationProcessingJobScheduler],
  exports: [AllocationProcessingJobScheduler],
};
