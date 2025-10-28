import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseFeaturesController } from './enterprise-features.controller';

describe('EnterpriseFeaturesController', () => {
  let controller: EnterpriseFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnterpriseFeaturesController],
    }).compile();

    controller = module.get<EnterpriseFeaturesController>(EnterpriseFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
