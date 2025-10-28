import { Test, TestingModule } from '@nestjs/testing';
import { HealthDomainController } from './health-domain.controller';

describe('HealthDomainController', () => {
  let controller: HealthDomainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthDomainController],
    }).compile();

    controller = module.get<HealthDomainController>(HealthDomainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
