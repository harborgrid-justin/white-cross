import { Test, TestingModule } from '@nestjs/testing';
import { ChronicConditionService } from './chronic-condition.service';

describe('ChronicConditionService', () => {
  let service: ChronicConditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChronicConditionService],
    }).compile();

    service = module.get<ChronicConditionService>(ChronicConditionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
