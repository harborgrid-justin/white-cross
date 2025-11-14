/**
 * @fileoverview Contact Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
