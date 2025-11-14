/**
 * @fileoverview Budget Controller Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

describe('BudgetController', () => {
  let controller: BudgetController;
  let service: jest.Mocked<BudgetService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        {
          provide: BudgetService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
    service = module.get(BudgetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all budgets', async () => {
    service.findAll.mockResolvedValue([]);
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should create budget', async () => {
    const createDto = { name: 'Q1 Budget', amount: 10000 };
    service.create.mockResolvedValue({ id: 'b1', ...createDto } as never);
    const result = await controller.create(createDto as never);
    expect(result).toHaveProperty('id');
  });
});
