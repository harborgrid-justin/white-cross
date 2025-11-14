/**
 * @fileoverview Communication Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from './communication.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
