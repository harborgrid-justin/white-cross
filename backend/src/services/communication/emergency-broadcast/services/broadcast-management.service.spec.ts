/**
 * @fileoverview Broadcast Management Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastManagementService } from './broadcast-management.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastManagementService', () => {
  let service: BroadcastManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastManagementService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastManagementService>(BroadcastManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
