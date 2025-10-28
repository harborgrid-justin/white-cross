import { Test, TestingModule } from '@nestjs/testing';
import { AllergyService } from './allergy.service';

describe('AllergyService', () => {
  let service: AllergyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergyService],
    }).compile();

    service = module.get<AllergyService>(AllergyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
