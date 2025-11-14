/**
 * @fileoverview Message Sender Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MessageSenderService } from './message-sender.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('MessageSenderService', () => {
  let service: MessageSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageSenderService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<MessageSenderService>(MessageSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
