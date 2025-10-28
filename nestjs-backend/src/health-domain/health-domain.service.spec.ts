import { Test, TestingModule } from '@nestjs/testing';
import { HealthDomainService } from './health-domain.service';

describe('HealthDomainService', () => {
  let service: HealthDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthDomainService],
    }).compile();

    service = module.get<HealthDomainService>(HealthDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
