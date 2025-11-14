/**
 * @fileoverview Broadcast Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from '../services/broadcast.service';

describe('BroadcastController', () => {
  let controller: BroadcastController;
  let service: jest.Mocked<BroadcastService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastController],
      providers: [
        {
          provide: BroadcastService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BroadcastController>(BroadcastController);
    service = module.get(BroadcastService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
