/**
 * @fileoverview Broadcast Priority Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastPriorityService } from './broadcast-priority.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastPriorityService', () => {
  let service: BroadcastPriorityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastPriorityService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastPriorityService>(BroadcastPriorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
