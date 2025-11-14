/**
 * @fileoverview Broadcast Recipient Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastRecipientService } from './broadcast-recipient.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastRecipientService', () => {
  let service: BroadcastRecipientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastRecipientService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastRecipientService>(BroadcastRecipientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
