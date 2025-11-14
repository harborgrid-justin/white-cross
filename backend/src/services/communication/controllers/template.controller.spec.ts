/**
 * @fileoverview Template Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from '../services/template.service';

describe('TemplateController', () => {
  let controller: TemplateController;
  let service: jest.Mocked<TemplateService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
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

    controller = module.get<TemplateController>(TemplateController);
    service = module.get(TemplateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
