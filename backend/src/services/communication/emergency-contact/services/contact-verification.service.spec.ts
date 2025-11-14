/**
 * @fileoverview Contact Verification Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactVerificationService } from './contact-verification.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ContactVerificationService', () => {
  let service: ContactVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactVerificationService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactVerificationService>(ContactVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
