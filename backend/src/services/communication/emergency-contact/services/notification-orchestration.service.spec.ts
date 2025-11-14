/**
 * @fileoverview Notification Orchestration Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationOrchestrationService } from './notification-orchestration.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('NotificationOrchestrationService', () => {
  let service: NotificationOrchestrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationOrchestrationService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<NotificationOrchestrationService>(NotificationOrchestrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
