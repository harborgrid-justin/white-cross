/**
 * @fileoverview Notification Delivery Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDeliveryService } from './notification-delivery.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('NotificationDeliveryService', () => {
  let service: NotificationDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationDeliveryService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<NotificationDeliveryService>(NotificationDeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
