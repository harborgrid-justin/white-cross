import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';

describe('SyncController', () => {
  let instance: SyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
    }).compile();

    instance = module.get<SyncController>(SyncController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
