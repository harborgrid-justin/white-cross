/**
 * @fileoverview Broadcast Template Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastTemplateService } from './broadcast-template.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastTemplateService', () => {
  let service: BroadcastTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastTemplateService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastTemplateService>(BroadcastTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
