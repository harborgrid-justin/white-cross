/**
 * @fileoverview Notification Queue Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationQueueService } from './notification-queue.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('NotificationQueueService', () => {
  let service: NotificationQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationQueueService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<NotificationQueueService>(NotificationQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
