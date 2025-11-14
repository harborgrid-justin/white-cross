/**
 * @fileoverview Broadcast Delivery Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastDeliveryService } from './broadcast-delivery.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BroadcastDeliveryService', () => {
  let service: BroadcastDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastDeliveryService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BroadcastDeliveryService>(BroadcastDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
