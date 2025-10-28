import { Test, TestingModule } from '@nestjs/testing';
import { MedicationInteractionService } from './medication-interaction.service';

describe('MedicationInteractionService', () => {
  let service: MedicationInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationInteractionService],
    }).compile();

    service = module.get<MedicationInteractionService>(MedicationInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
