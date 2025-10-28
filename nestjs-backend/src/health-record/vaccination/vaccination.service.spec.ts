import { Test, TestingModule } from '@nestjs/testing';
import { VaccinationService } from './vaccination.service';

describe('VaccinationService', () => {
  let service: VaccinationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaccinationService],
    }).compile();

    service = module.get<VaccinationService>(VaccinationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
