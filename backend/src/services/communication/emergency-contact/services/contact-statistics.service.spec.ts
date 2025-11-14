/**
 * @fileoverview Contact Statistics Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ContactStatisticsService } from './contact-statistics.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('ContactStatisticsService', () => {
  let service: ContactStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactStatisticsService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<ContactStatisticsService>(ContactStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
