import { Test, TestingModule } from '@nestjs/testing';
import { MedicationInteractionController } from './medication-interaction.controller';

describe('MedicationInteractionController', () => {
  let controller: MedicationInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationInteractionController],
    }).compile();

    controller = module.get<MedicationInteractionController>(MedicationInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
