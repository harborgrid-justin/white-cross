/**
 * @fileoverview Budget Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        { provide: RequestContextService, useValue: { requestId: 'test', getLogContext: jest.fn() } },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
