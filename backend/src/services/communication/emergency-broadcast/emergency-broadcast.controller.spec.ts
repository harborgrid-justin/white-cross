/**
 * @fileoverview Emergency Broadcast Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';

describe('EmergencyBroadcastController', () => {
  let controller: EmergencyBroadcastController;
  let service: jest.Mocked<EmergencyBroadcastService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyBroadcastController],
      providers: [
        {
          provide: EmergencyBroadcastService,
          useValue: {
            createBroadcast: jest.fn(),
            getBroadcasts: jest.fn(),
            getBroadcastById: jest.fn(),
            updateBroadcast: jest.fn(),
            cancelBroadcast: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmergencyBroadcastController>(EmergencyBroadcastController);
    service = module.get(EmergencyBroadcastService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
