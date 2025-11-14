/**
 * @fileoverview Message Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
