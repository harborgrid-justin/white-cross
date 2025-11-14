/**
 * @fileoverview Message Management Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessageManagementService } from './message-management.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('MessageManagementService', () => {
  let service: MessageManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageManagementService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<MessageManagementService>(MessageManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
