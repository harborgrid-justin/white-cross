/**
 * @fileoverview Budget Service Unit Tests
 * @module budget/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BudgetService } from '../budget.service';
import { BudgetCategory, BudgetTransaction } from '@/database';

describe('BudgetService', () => {
  let service: BudgetService;
  let mockBudgetCategoryModel: any;
  let mockBudgetTransactionModel: any;

  const mockCategory = {
    id: 'category-1',
    name: 'Medical Supplies',
    fiscalYear: 2025,
    budgetedAmount: 50000,
    spentAmount: 25000,
    isActive: true,
    description: 'Budget for medical supplies',
    createdAt: new Date(),
    updatedAt: new Date(),
    transactions: [],
  };

  const mockTransaction = {
    id: 'transaction-1',
    budgetCategoryId: 'category-1',
    description: 'First aid kits',
    amount: 500,
    transactionDate: new Date('2025-08-15'),
    vendor: 'Medical Supply Co',
    invoiceNumber: 'INV-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockBudgetCategoryModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      sum: jest.fn(),
    };

    mockBudgetTransactionModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      sum: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getModelToken(BudgetCategory),
          useValue: mockBudgetCategoryModel,
        },
        {
          provide: getModelToken(BudgetTransaction),
          useValue: mockBudgetTransactionModel,
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getBudgetCategories', () => {
    it('should return all active categories for current fiscal year', async () => {
      const categories = [mockCategory];
      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      const result = await service.getBudgetCategories();

      expect(mockBudgetCategoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        })
      );
      expect(result).toEqual(categories);
    });

    it('should filter by specific fiscal year', async () => {
      const categories = [{ ...mockCategory, fiscalYear: 2024 }];
      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      await service.getBudgetCategories(2024);

      expect(mockBudgetCategoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ fiscalYear: 2024 }),
        })
      );
    });

    it('should include inactive categories when activeOnly is false', async () => {
      const categories = [mockCategory];
      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      await service.getBudgetCategories(2025, false);

      expect(mockBudgetCategoryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({ isActive: expect.anything() }),
        })
      );
    });
  });

  describe('getBudgetCategoryById', () => {
    it('should return category by ID with transactions', async () => {
      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(mockCategory);

      const result = await service.getBudgetCategoryById('category-1');

      expect(mockBudgetCategoryModel.findOne).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        include: expect.any(Array),
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(null);

      await expect(
        service.getBudgetCategoryById('non-existent-id')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBudgetCategory', () => {
    it('should create a budget category successfully', async () => {
      const createDto = {
        name: 'Technology',
        fiscalYear: 2025,
        budgetedAmount: 30000,
        description: 'IT equipment and software',
      };

      mockBudgetCategoryModel.create.mockResolvedValueOnce({
        ...mockCategory,
        ...createDto,
      });

      const result = await service.createBudgetCategory(createDto);

      expect(mockBudgetCategoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          spentAmount: 0,
          isActive: true,
        })
      );
      expect(result.name).toBe('Technology');
    });

    it('should throw ConflictException for duplicate category name in same fiscal year', async () => {
      const createDto = {
        name: 'Medical Supplies',
        fiscalYear: 2025,
        budgetedAmount: 40000,
      };

      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(mockCategory);

      await expect(service.createBudgetCategory(createDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('updateBudgetCategory', () => {
    it('should update budget category successfully', async () => {
      const updateDto = {
        budgetedAmount: 60000,
        description: 'Updated description',
      };

      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(mockCategory);
      mockBudgetCategoryModel.update.mockResolvedValueOnce([1]);
      mockBudgetCategoryModel.findOne.mockResolvedValueOnce({
        ...mockCategory,
        ...updateDto,
      });

      const result = await service.updateBudgetCategory('category-1', updateDto);

      expect(mockBudgetCategoryModel.update).toHaveBeenCalledWith(
        updateDto,
        { where: { id: 'category-1' } }
      );
      expect(result.budgetedAmount).toBe(60000);
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateBudgetCategory('non-existent-id', { budgetedAmount: 50000 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBudgetCategory', () => {
    it('should soft delete budget category', async () => {
      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(mockCategory);
      mockBudgetCategoryModel.update.mockResolvedValueOnce([1]);

      await service.deleteBudgetCategory('category-1');

      expect(mockBudgetCategoryModel.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { id: 'category-1' } }
      );
    });
  });

  describe('createBudgetTransaction', () => {
    it('should create a transaction and update category spent amount', async () => {
      const createDto = {
        budgetCategoryId: 'category-1',
        description: 'Bandages',
        amount: 250,
        transactionDate: '2025-09-01',
        vendor: 'Medical Supply Co',
      };

      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(mockCategory);
      mockBudgetTransactionModel.create.mockResolvedValueOnce(mockTransaction);
      mockBudgetCategoryModel.update.mockResolvedValueOnce([1]);

      const result = await service.createBudgetTransaction(createDto);

      expect(mockBudgetTransactionModel.create).toHaveBeenCalled();
      expect(mockBudgetCategoryModel.update).toHaveBeenCalledWith(
        { spentAmount: expect.any(Number) },
        { where: { id: 'category-1' } }
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException for invalid category', async () => {
      const createDto = {
        budgetCategoryId: 'invalid-id',
        description: 'Test',
        amount: 100,
        transactionDate: '2025-09-01',
      };

      mockBudgetCategoryModel.findOne.mockResolvedValueOnce(null);

      await expect(service.createBudgetTransaction(createDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getTransactionsByCategory', () => {
    it('should return transactions for a category', async () => {
      const transactions = [mockTransaction];
      mockBudgetTransactionModel.findAll.mockResolvedValueOnce(transactions);

      const result = await service.getTransactionsByCategory('category-1');

      expect(mockBudgetTransactionModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { budgetCategoryId: 'category-1' },
        })
      );
      expect(result).toEqual(transactions);
    });
  });

  describe('getBudgetSummary', () => {
    it('should return budget summary for fiscal year', async () => {
      const categories = [
        { ...mockCategory, budgetedAmount: 50000, spentAmount: 30000 },
        { ...mockCategory, budgetedAmount: 30000, spentAmount: 15000 },
      ];

      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      const summary = await service.getBudgetSummary(2025);

      expect(summary.fiscalYear).toBe(2025);
      expect(summary.totalBudgeted).toBe(80000);
      expect(summary.totalSpent).toBe(45000);
      expect(summary.totalRemaining).toBe(35000);
      expect(summary.percentSpent).toBeCloseTo(56.25, 1);
    });

    it('should identify over-budget categories', async () => {
      const categories = [
        { ...mockCategory, budgetedAmount: 50000, spentAmount: 60000 },
      ];

      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      const summary = await service.getBudgetSummary(2025);

      expect(summary.overBudgetCategories).toHaveLength(1);
      expect(summary.overBudgetCategories[0]).toMatchObject({
        id: 'category-1',
        overage: 10000,
      });
    });
  });

  describe('getSpendingTrends', () => {
    it('should return spending trends by month', async () => {
      const transactions = [
        { ...mockTransaction, amount: 500, transactionDate: new Date('2025-08-15') },
        { ...mockTransaction, amount: 300, transactionDate: new Date('2025-08-20') },
        { ...mockTransaction, amount: 400, transactionDate: new Date('2025-09-10') },
      ];

      mockBudgetTransactionModel.findAll.mockResolvedValueOnce(transactions);

      const trends = await service.getSpendingTrends('category-1', 2025);

      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
    });
  });

  describe('getBudgetRecommendations', () => {
    it('should generate budget recommendations', async () => {
      const categories = [
        { ...mockCategory, budgetedAmount: 50000, spentAmount: 48000 }, // Near budget
        { ...mockCategory, budgetedAmount: 30000, spentAmount: 15000 }, // Under-utilized
      ];

      mockBudgetCategoryModel.findAll.mockResolvedValueOnce(categories);

      const recommendations = await service.getBudgetRecommendations(2025);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('validateFiscalYear', () => {
    it('should validate current fiscal year', () => {
      const currentDate = new Date('2025-08-15'); // August is in FY 2026
      const fiscalYear = service.getCurrentFiscalYear(currentDate);

      expect(fiscalYear).toBe(2026);
    });

    it('should validate fiscal year before July', () => {
      const currentDate = new Date('2025-05-15'); // May is in FY 2025
      const fiscalYear = service.getCurrentFiscalYear(currentDate);

      expect(fiscalYear).toBe(2025);
    });
  });
});
