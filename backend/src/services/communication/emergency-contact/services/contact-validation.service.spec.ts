/**
 * @fileoverview Contact Validation Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactValidationService } from './contact-validation.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ContactValidationService', () => {
  let service: ContactValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactValidationService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactValidationService>(ContactValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
