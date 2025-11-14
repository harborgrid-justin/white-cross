/**
 * @fileoverview Contact Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './services/contact.service';

describe('ContactController', () => {
  let controller: ContactController;
  let service: jest.Mocked<ContactService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
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

    controller = module.get<ContactController>(ContactController);
    service = module.get(ContactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
