/**
 * @fileoverview Conversation Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
