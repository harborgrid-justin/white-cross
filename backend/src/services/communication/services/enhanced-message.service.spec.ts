/**
 * @fileoverview Enhanced Message Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EnhancedMessageService } from './enhanced-message.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('EnhancedMessageService', () => {
  let service: EnhancedMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnhancedMessageService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<EnhancedMessageService>(EnhancedMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
