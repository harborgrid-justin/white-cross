/**
 * @fileoverview Contact Management Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactManagementService } from './contact-management.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ContactManagementService', () => {
  let service: ContactManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactManagementService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactManagementService>(ContactManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
