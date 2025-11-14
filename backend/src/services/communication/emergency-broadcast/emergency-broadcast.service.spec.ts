/**
 * @fileoverview Emergency Broadcast Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyBroadcastService } from './emergency-broadcast.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('EmergencyBroadcastService', () => {
  let service: EmergencyBroadcastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyBroadcastService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<EmergencyBroadcastService>(EmergencyBroadcastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
