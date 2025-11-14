/**
 * @fileoverview Tests for Base Queue Service
 * @module infrastructure/queue/services
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BaseQueueService } from './base-queue.service';
import { QueueConfigService } from '../queue.config';
import { QueueName, JobPriority } from '../enums';
import type { Queue, Job } from 'bull';

// Concrete implementation for testing
class TestQueueService extends BaseQueueService {
  constructor(queueConfig: QueueConfigService) {
    super(queueConfig, 'TestQueueService');
  }

  public exposeRegisterQueue(name: QueueName, queue: Queue): void {
    this.registerQueue(name, queue);
  }

  public exposeGetQueue(name: QueueName): Queue {
    return this.getQueue(name);
  }

  public exposeAddJobToQueue<T>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: Parameters<BaseQueueService['addJobToQueue']>[3],
  ): ReturnType<BaseQueueService['addJobToQueue']> {
    return this.addJobToQueue(queueName, jobName, data, options);
  }
}

describe('BaseQueueService', () => {
  let service: TestQueueService;
  let mockQueueConfig: jest.Mocked<QueueConfigService>;
  let mockQueue: jest.Mocked<Queue>;
  let mockJob: jest.Mocked<Job>;

  const mockConfig = {
    name: QueueName.EMAIL,
    concurrency: 5,
    maxAttempts: 3,
    timeout: 30000,
    backoffType: 'exponential',
    backoffDelay: 1000,
    removeOnCompleteCount: 100,
    removeOnCompleteAge: 86400,
    removeOnFailCount: 1000,
    removeOnFailAge: 604800,
  };

  beforeEach(async () => {
    mockJob = {
      id: 'job-123',
      data: {},
    } as unknown as jest.Mocked<Job>;

    mockQueue = {
      add: jest.fn().mockResolvedValue(mockJob),
      addBulk: jest.fn().mockResolvedValue([mockJob]),
      getWaitingCount: jest.fn().mockResolvedValue(10),
      getActiveCount: jest.fn().mockResolvedValue(5),
      getCompletedCount: jest.fn().mockResolvedValue(100),
      getFailedCount: jest.fn().mockResolvedValue(2),
      getDelayedCount: jest.fn().mockResolvedValue(3),
      getPausedCount: jest.fn().mockResolvedValue(0),
      getJob: jest.fn().mockResolvedValue(mockJob),
      getWaiting: jest.fn().mockResolvedValue([mockJob]),
      getActive: jest.fn().mockResolvedValue([mockJob]),
      getCompleted: jest.fn().mockResolvedValue([mockJob]),
      getFailed: jest.fn().mockResolvedValue([mockJob]),
      getDelayed: jest.fn().mockResolvedValue([mockJob]),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      clean: jest.fn().mockResolvedValue([]),
      close: jest.fn().mockResolvedValue(undefined),
      client: {
        ping: jest.fn().mockResolvedValue('PONG'),
      },
    } as unknown as jest.Mocked<Queue>;

    mockQueueConfig = {
      getQueueConfig: jest.fn().mockReturnValue(mockConfig),
      getAllQueueConfigs: jest.fn().mockReturnValue({ [QueueName.EMAIL]: mockConfig }),
      getRedisConnectionString: jest.fn().mockReturnValue('redis://localhost:6379'),
      getJobOptionsForPriority: jest.fn().mockReturnValue({ attempts: 3, backoff: { type: 'exponential', delay: 1000 } }),
    } as unknown as jest.Mocked<QueueConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestQueueService,
        {
          provide: QueueConfigService,
          useValue: mockQueueConfig,
        },
      ],
    }).compile();

    service = module.get<TestQueueService>(TestQueueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should log initialization on module init', () => {
      service.onModuleInit();
      expect(mockQueueConfig.getRedisConnectionString).toHaveBeenCalled();
    });

    it('should close queues on module destroy', async () => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
      await service.onModuleDestroy();
      expect(mockQueue.close).toHaveBeenCalled();
    });
  });

  describe('Queue Management', () => {
    it('should register a queue', () => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
      const retrievedQueue = service.exposeGetQueue(QueueName.EMAIL);
      expect(retrievedQueue).toBe(mockQueue);
    });

    it('should throw error when getting unregistered queue', () => {
      expect(() => service.exposeGetQueue(QueueName.EMAIL)).toThrow('Queue EMAIL not registered');
    });

    it('should get all registered queue names', () => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
      const names = service['getRegisteredQueueNames']();
      expect(names).toContain(QueueName.EMAIL);
    });
  });

  describe('Adding Jobs', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should add job to queue', async () => {
      const jobData = { to: 'test@example.com' };
      const job = await service.exposeAddJobToQueue(QueueName.EMAIL, 'send-email', jobData);

      expect(mockQueue.add).toHaveBeenCalledWith('send-email', jobData, expect.any(Object));
      expect(job).toBe(mockJob);
    });

    it('should add job with custom options', async () => {
      const jobData = { to: 'test@example.com' };
      const options = { priority: JobPriority.HIGH, delay: 1000 };

      await service.exposeAddJobToQueue(QueueName.EMAIL, 'send-email', jobData, options);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-email',
        jobData,
        expect.objectContaining({ priority: JobPriority.HIGH, delay: 1000 }),
      );
    });

    it('should add batch jobs', async () => {
      const jobs = [
        { name: 'job1', data: { id: 1 } },
        { name: 'job2', data: { id: 2 } },
      ];

      const result = await service['addBatchJobsToQueue'](QueueName.EMAIL, jobs);

      expect(mockQueue.addBulk).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('Queue Statistics', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should get queue stats', async () => {
      const stats = await service.getQueueStats(QueueName.EMAIL);

      expect(stats).toEqual({
        name: QueueName.EMAIL,
        waiting: 10,
        active: 5,
        completed: 100,
        failed: 2,
        delayed: 3,
        paused: 0,
      });
    });

    it('should get metrics for all queues', async () => {
      const metrics = await service.getQueueMetrics();

      expect(metrics.queues[QueueName.EMAIL]).toBeDefined();
      expect(metrics.totals.waiting).toBe(10);
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Queue Health', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should report healthy status', async () => {
      const health = await service.getQueueHealth(QueueName.EMAIL);

      expect(health.status).toBe('healthy');
      expect(health.checks.redis).toBe(true);
    });

    it('should report unhealthy when Redis disconnected', async () => {
      mockQueue.client.ping.mockRejectedValueOnce(new Error('Connection failed'));

      const health = await service.getQueueHealth(QueueName.EMAIL);

      expect(health.status).toBe('unhealthy');
      expect(health.checks.redis).toBe(false);
    });

    it('should report degraded with high waiting count', async () => {
      mockQueue.getWaitingCount.mockResolvedValueOnce(2000);

      const health = await service.getQueueHealth(QueueName.EMAIL);

      expect(health.status).toBe('degraded');
    });
  });

  describe('Failed Jobs', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should get failed jobs', async () => {
      const failedJob = {
        id: 'failed-123',
        data: { test: 'data' },
        failedReason: 'Test error',
        stacktrace: ['line1', 'line2'],
        attemptsMade: 3,
        finishedOn: Date.now(),
        timestamp: Date.now(),
      };

      mockQueue.getFailed.mockResolvedValueOnce([failedJob as unknown as Job]);

      const failedJobs = await service.getFailedJobs(QueueName.EMAIL);

      expect(failedJobs).toHaveLength(1);
      expect(failedJobs[0].jobId).toBe('failed-123');
    });

    it('should retry failed job', async () => {
      mockJob.retry = jest.fn().mockResolvedValue(undefined);

      await service.retryFailedJob(QueueName.EMAIL, 'job-123');

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-123');
      expect(mockJob.retry).toHaveBeenCalled();
    });

    it('should throw error when retrying non-existent job', async () => {
      mockQueue.getJob.mockResolvedValueOnce(null);

      await expect(service.retryFailedJob(QueueName.EMAIL, 'nonexistent')).rejects.toThrow(
        'Job nonexistent not found',
      );
    });
  });

  describe('Queue Operations', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should pause queue', async () => {
      await service.pauseQueue(QueueName.EMAIL);
      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume queue', async () => {
      await service.resumeQueue(QueueName.EMAIL);
      expect(mockQueue.resume).toHaveBeenCalled();
    });

    it('should clean queue', async () => {
      await service.cleanQueue(QueueName.EMAIL);
      expect(mockQueue.clean).toHaveBeenCalled();
    });

    it('should remove job', async () => {
      mockJob.remove = jest.fn().mockResolvedValue(undefined);

      await service.removeJob(QueueName.EMAIL, 'job-123');

      expect(mockJob.remove).toHaveBeenCalled();
    });

    it('should get job by ID', async () => {
      const job = await service.getJob(QueueName.EMAIL, 'job-123');
      expect(job).toBe(mockJob);
    });
  });

  describe('Get Jobs By Status', () => {
    beforeEach(() => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
    });

    it('should get waiting jobs', async () => {
      const jobs = await service.getJobsByStatus(QueueName.EMAIL, 'waiting');
      expect(mockQueue.getWaiting).toHaveBeenCalled();
      expect(jobs).toEqual([mockJob]);
    });

    it('should get active jobs', async () => {
      const jobs = await service.getJobsByStatus(QueueName.EMAIL, 'active');
      expect(mockQueue.getActive).toHaveBeenCalled();
    });

    it('should get completed jobs', async () => {
      const jobs = await service.getJobsByStatus(QueueName.EMAIL, 'completed');
      expect(mockQueue.getCompleted).toHaveBeenCalled();
    });

    it('should get failed jobs', async () => {
      const jobs = await service.getJobsByStatus(QueueName.EMAIL, 'failed');
      expect(mockQueue.getFailed).toHaveBeenCalled();
    });

    it('should get delayed jobs', async () => {
      const jobs = await service.getJobsByStatus(QueueName.EMAIL, 'delayed');
      expect(mockQueue.getDelayed).toHaveBeenCalled();
    });

    it('should throw error for unknown status', async () => {
      await expect(
        service.getJobsByStatus(QueueName.EMAIL, 'unknown' as 'waiting'),
      ).rejects.toThrow('Unknown job status');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple queues', () => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
      service.exposeRegisterQueue(QueueName.NOTIFICATION, mockQueue);

      const names = service['getRegisteredQueueNames']();
      expect(names).toHaveLength(2);
    });

    it('should close all queues on destroy', async () => {
      service.exposeRegisterQueue(QueueName.EMAIL, mockQueue);
      service.exposeRegisterQueue(QueueName.NOTIFICATION, mockQueue);

      await service.onModuleDestroy();

      expect(mockQueue.close).toHaveBeenCalledTimes(2);
    });
  });
});
