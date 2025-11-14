/**
 * @fileoverview Channel Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ChannelService', () => {
  let service: ChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
