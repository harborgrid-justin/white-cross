/**
 * @fileoverview Message Query Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessageQueryService } from './message-query.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('MessageQueryService', () => {
  let service: MessageQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageQueryService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<MessageQueryService>(MessageQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
