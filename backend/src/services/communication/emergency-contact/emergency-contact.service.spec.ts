/**
 * @fileoverview Emergency Contact Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyContactService } from './emergency-contact.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('EmergencyContactService', () => {
  let service: EmergencyContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyContactService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<EmergencyContactService>(EmergencyContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
