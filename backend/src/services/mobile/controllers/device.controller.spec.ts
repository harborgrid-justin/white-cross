import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';

describe('DeviceController', () => {
  let instance: DeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
    }).compile();

    instance = module.get<DeviceController>(DeviceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(instance).toBeDefined();
  });
});
