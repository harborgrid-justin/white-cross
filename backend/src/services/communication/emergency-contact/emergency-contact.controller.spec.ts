/**
 * @fileoverview Emergency Contact Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyContactController } from './emergency-contact.controller';
import { EmergencyContactService } from './emergency-contact.service';

describe('EmergencyContactController', () => {
  let controller: EmergencyContactController;
  let service: jest.Mocked<EmergencyContactService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyContactController],
      providers: [
        {
          provide: EmergencyContactService,
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

    controller = module.get<EmergencyContactController>(EmergencyContactController);
    service = module.get(EmergencyContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
