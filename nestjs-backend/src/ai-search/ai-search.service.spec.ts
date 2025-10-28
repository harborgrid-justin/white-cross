import { Test, TestingModule } from '@nestjs/testing';
import { AiSearchService } from './ai-search.service';

describe('AiSearchService', () => {
  let service: AiSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSearchService],
    }).compile();

    service = module.get<AiSearchService>(AiSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
