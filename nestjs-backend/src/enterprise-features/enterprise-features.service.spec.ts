import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseFeaturesService } from './enterprise-features.service';

describe('EnterpriseFeaturesService', () => {
  let service: EnterpriseFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterpriseFeaturesService],
    }).compile();

    service = module.get<EnterpriseFeaturesService>(EnterpriseFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
