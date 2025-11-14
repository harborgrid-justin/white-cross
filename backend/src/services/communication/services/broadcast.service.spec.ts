/**
 * @fileoverview Broadcast Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastService } from './broadcast.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastService', () => {
  let service: BroadcastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastService>(BroadcastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
