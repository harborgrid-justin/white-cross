/**
 * @fileoverview Template Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<TemplateService>(service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
